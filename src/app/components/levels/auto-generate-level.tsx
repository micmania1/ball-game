import * as THREE from 'three';
import { BufferGeometry, Group } from 'three';
import {
  Collider,
  ColliderDesc,
  RigidBody,
  RigidBodyDesc,
  RigidBodyType,
} from '@dimforge/rapier3d-compat';
import { RigidBodyTypeString, useRapier } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import useVector3 from '../../utils/use-vector3';
import { useEffect } from 'react';
import {
  collisionGroups,
  friction,
  PhysicsGroup,
  restitution,
} from '../../config/physics';
import useBox3 from '../../utils/use-box3';
import useQuaternion from '../../utils/use-quaternion';
import Goal from '../physics/goal';
import { useLevelContext } from '../providers/level-provider';

type LevelMapProp = {
  url: string;
};
export default function AutoGenerateLevel({ url }: LevelMapProp) {
  const { world } = useRapier();
  const { scene } = useGLTF(url);
  const goalPosition = useVector3();
  const goalQuaternion = useQuaternion();
  const level = useLevelContext();

  // This is to trigger the useEffect below to be recalled when
  // The size of the objects change after being rendered
  const size = useVector3();
  const box = useBox3().setFromObject(scene);
  box.getSize(size);

  useEffect(() => {
    const rigidBodies: RigidBody[] = [];
    const colliders: Collider[] = [];

    scene.traverse((object) => {
      if (isMesh(object)) {
        object.castShadow = true;
        object.receiveShadow = true;
      }

      if (isGoalIndicator(object)) {
        goalPosition.setFromMatrixPosition(object.matrixWorld);
        goalQuaternion.setFromRotationMatrix(object.matrixWorld);
        object.visible = !object.userData.hidden;
      }

      if (shouldHavePhysics(object)) {
        const group = object.userData.group;

        const rigidBodyType = rigidBodyTypeFromString(
          object.userData.rigid_body_type
        );
        const rigidBodyDescription = new RigidBodyDesc(rigidBodyType);
        const rigidBody = world.createRigidBody(rigidBodyDescription);

        const colliderDesc = createColliderDesc(object);
        const collider = world.createCollider(colliderDesc, rigidBody);
        collider.setCollisionGroups(collisionGroups[group]);
        collider.setFriction(friction[group]);
        collider.setRestitution(restitution[group]);

        const position = new THREE.Vector3();
        position.setFromMatrixPosition(object.matrixWorld);
        rigidBody.setTranslation(position, true);

        rigidBody.setRotation(object.quaternion, true);

        rigidBodies.push(rigidBody);
        colliders.push(collider);
      }
    });

    return () => {
      colliders.forEach((collider) => {
        const c = world.getCollider(collider.handle);
        if (c) {
          world.removeCollider(c, true);
        }
      });

      rigidBodies.forEach((rigidBody) => {
        const rb = world.getRigidBody(rigidBody.handle);
        if (rb) {
          world.removeRigidBody(rb);
        }
      });
    };
  }, [scene, world, size.x, size.y, size.z, goalPosition, goalQuaternion]);

  return (
    <>
      <primitive object={scene} />
      <Goal
        position={goalPosition.toArray()}
        size={[5, 5, 5]}
        onEnter={() => level.won()}
      />
    </>
  );
}

function rigidBodyTypeFromString(name: RigidBodyTypeString): RigidBodyType {
  switch (name) {
    case 'fixed':
      return RigidBodyType.Fixed;
    case 'dynamic':
      return RigidBodyType.Dynamic;
    case 'kinematicPosition':
      return RigidBodyType.KinematicPositionBased;
    case 'kinematicVelocity':
      return RigidBodyType.KinematicVelocityBased;
  }
}

function isMesh(object: THREE.Object3D): object is THREE.Mesh {
  return (object as THREE.Mesh).isMesh === true;
}

type IndicatorMesh = Omit<THREE.Mesh, 'userData'> & {
  parent: Group;
  userData: {
    group: 'won';
    hidden: boolean;
  };
};

function isIndicatorMesh(object: THREE.Object3D): object is IndicatorMesh {
  const indicatorMesh = object as IndicatorMesh;

  const indicatorGroups = ['won'];
  return (
    indicatorMesh.isMesh &&
    indicatorMesh.parent?.isGroup &&
    indicatorGroups.indexOf(indicatorMesh.userData.group) > -1
  );
}

function isGoalIndicator(object: THREE.Object3D): object is IndicatorMesh {
  const indicatorMesh = isIndicatorMesh(object);

  return indicatorMesh ? object.userData.group === 'won' : false;
}

type RigidBodyMesh = Omit<THREE.Mesh, 'parent' | 'geometry' | 'userData'> & {
  parent: Group;
  geometry: BufferGeometry & {
    attributes: { position: { array: Float32Array } };
    index: { array: Uint32Array };
  };
  userData: {
    group: PhysicsGroup;
    rigid_body_type: RigidBodyTypeString;
  };
};

function shouldHavePhysics(object: THREE.Object3D): object is RigidBodyMesh {
  const childMesh = object as RigidBodyMesh;

  const isChildMesh = childMesh.isMesh && childMesh.parent?.isGroup;
  if (!isChildMesh) {
    return false;
  }

  const vertices = childMesh.geometry.getAttribute('position')?.array;
  const indices = childMesh.geometry.getIndex()?.array;
  if (
    !(vertices instanceof Float32Array) ||
    !(indices instanceof Uint32Array)
  ) {
    return false;
  }

  const validGroups = Object.keys(collisionGroups);
  if (validGroups.indexOf(childMesh.userData?.group) < 0) {
    return false;
  }

  const validRigidBodyTypes = [
    'fixed',
    'dynamic',
    'kinematicPosition',
    'kinematicVelocity',
  ];
  if (validRigidBodyTypes.indexOf(childMesh.userData?.rigid_body_type) < 0) {
    return false;
  }

  return true;
}

function createTrimeshCollider(object: RigidBodyMesh) {
  const vertices = object.geometry.attributes.position.array;
  const indices = object.geometry.index.array;

  return ColliderDesc.trimesh(vertices, indices);
}

function createColliderDesc(object: RigidBodyMesh) {
  return createTrimeshCollider(object);
}
