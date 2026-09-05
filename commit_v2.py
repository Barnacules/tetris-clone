import subprocess, os

os.chdir('C:/temp/ling/tetris')

# Stage all files
subprocess.run(['git', 'add', '-A'], check=True)

# Amend the commit with all new changes
subprocess.run(['git', 'commit', '--amend', '-m', 'Version 2.0: Three.js 3D background with bloom, multi-layer BGM, particle effects, matrix rain, screen shake, responsive canvas. 168 unit tests.'], check=True)

# Create v2.0 tag
subprocess.run(['git', 'tag', '-d', 'v2.0'], capture_output=True)
subprocess.run(['git', 'tag', 'v2.0'], check=True)

# Push
subprocess.run(['git', 'push', 'origin', 'master', '--tags', '--force'], check=True)

print('\nAll changes committed and pushed!')
print('Tags: v1.0, v2.0')
print('Repo: https://github.com/Barnacules/tetris-clone')
