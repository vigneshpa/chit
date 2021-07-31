import type Repos from '../Entites';

export default function makeCheckGroup(repos: Repos) {
  return async function checkGroup({ name }: { name: string }) {
    // Checking existance
    let count = await repos.Group.findOne({ name });
    return !!count;
  };
}
