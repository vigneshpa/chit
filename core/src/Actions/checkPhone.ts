import type Repos from '../Entites';

export default function makeCheckPhone(repos: Repos) {
  return async function checkPhone({ phone }: { phone: string }) {
    // Checking existance
    let count = await repos.Client.findOne({ phone });
    return count?.name || false;
  };
}
