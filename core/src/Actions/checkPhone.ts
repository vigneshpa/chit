import type Repos from '../Entites';

export default function makeCheckPhone(repos: Repos) {
  /**
   * checks for existance of a phone number
   * @returns weather phone number exists
   * @param phone Phone number
   */
  return async function checkPhone({ phone }: { phone: string }) {
    // Checking existance
    let count = await repos.User.findOne({ phone });
    return count?.name || false;
  };
}
