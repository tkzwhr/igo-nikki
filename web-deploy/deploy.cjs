const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const config = {
  host: process.env.HOME_FTP_ADDR,
  port: 21,
  user: process.env.HOME_FTP_USER,
  password: process.env.HOME_FTP_PASSWD,
  localRoot: __dirname + '/../web/dist',
  remoteRoot: '/www/igo-nikki',
  include: ['*', '**/*'],
  exclude: [],
  deleteRemote: true,
  forcePasv: true,
  sftp: false,
};

ftpDeploy
  .deploy(config)
  .then((res) => console.log('finished:', res))
  .catch((err) => console.log(err));
