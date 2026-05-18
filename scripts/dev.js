import { spawn } from 'node:child_process';

const children = [];

function run(label, command) {
  const child = process.platform === 'win32'
    ? spawn('cmd.exe', ['/c', 'npm', 'run', command], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: false
    })
    : spawn('npm', ['run', command], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: false
    });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      shutdown(code);
    }
  });

  children.push(child);
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('dev:api', 'dev:api');
run('dev:client', 'dev:client');
