const keyData: JsonWebKey = {
  alg: 'HS512',
  ext: true,
  k: 'YFnN8Gn2mVTnAuxoq7Ia6y8cANKS7AU18B1upDFjcu8lyCQ2ohRv3z3L66ypoG6E0qabfTEoeTXltYdC4kYlzfHlzgBLHw11mt3aULnSsMEpbRxtLj_zrz5FvLdb3iYvkbcvLX5PQFPQlhV7y6oXjnJ89ywC1JrRPM674-axWI0',
  key_ops: ['sign', 'verify'],
  kty: 'oct',
};
export default crypto.subtle.importKey('jwk', keyData, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign', 'verify']);
