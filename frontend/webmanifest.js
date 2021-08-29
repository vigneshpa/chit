const { join } = require('path');
module.exports = publicPath => {
  const sizes = [96, 128, 192, 256, 384, 512];
  function generateIconSources(src) {
    const ret = [];
    if (src) {
      ret.push({ src: join(publicPath, src + '.svg'), sizes: '1024x1024', purpose: 'any' });
      ret.push({ src: join(publicPath, src + '_maskable.svg'), sizes: '1024x1024', purpose: 'maskable' });
      sizes.forEach(size => {
        ret.push({ src: join(publicPath, src + size + '.png'), sizes: size + 'x' + size, purpose: 'any' });
        ret.push({ src: join(publicPath, src + '_maskable' + size + '.png'), sizes: size + 'x' + size, purpose: 'maskable' });
      });
    }
    return ret;
  }
  const manifest = {
    name: 'Chit App',
    short_name: 'Chit',
    description: 'An easy way to manage chits!',
    background_color: '#303f9f',
    theme_color: '#303f9f',
    orientation: 'portrait',
    display: 'standalone',
    start_url: '.',
    icons: generateIconSources('icons/icon'),
    shortcuts: [
      {
        name: 'View Clients',
        short_name: 'Clients',
        description: 'View the list of clients you have enroled',
        url: join(publicPath, '/clients'),
        icons: generateIconSources('icons/people'),
      },
      {
        name: 'Add a Client',
        short_name: 'Add Client',
        description: 'Enroll a new Client',
        url: join(publicPath, '/clients/add'),
        icons: generateIconSources('icons/person_add'),
      },
      {
        name: 'View Groups',
        short_name: 'Groups',
        description: 'View the list of Groups you have created',
        url: join(publicPath, '/groups'),
        icons: generateIconSources('icons/groups'),
      },
      {
        name: 'Add a Group',
        short_name: 'Add Group',
        description: 'Create a new Group',
        url: join(publicPath, '/groups/add'),
        icons: generateIconSources('icons/group_add'),
      },
      {
        name: 'Backup and Restore',
        short_name: 'Backup',
        description: 'Backup and Restore the application data',
        url: join(publicPath, '/backup'),
        icons: generateIconSources('icons/settings_backup_restore'),
      },
    ],
  };
  return JSON.stringify(manifest);
};
