import levels from '../config/levels';
import { Redirect } from 'wouter';

export default function RouteFallback() {
  return <Redirect to={levels.start.url} />;
}
