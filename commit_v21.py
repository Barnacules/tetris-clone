import os, subprocess
os.chdir('C:/temp/ling/tetris')

# Fix README version history
with open('README.md', 'r') as f:
    content = f.read()

old = """| 2.0 | Enhanced | Three.js 3D background with bloom, multi-layer BGM, particle effects, matrix rain, screen shake, responsive canvas. 168 unit tests |"""
new = """| 2.0 | Enhanced | Three.js 3D background with bloom, multi-layer BGM, particle effects, matrix rain, screen shake, responsive canvas. 168 unit tests |
| 2.1 | Bug Fix | Fixed BLOCK variable scoping error causing INIT ERROR, fixed overlay text centering |"""

content = content.replace(old, new)
with open('README.md', 'w') as f:
    f.write(content)

# Stage and commit
subprocess.run(['git', 'add', '-A'], check=True)
subprocess.run(['git', 'commit', '-m', 'Version 2.1: Fix BLOCK scoping error causing INIT ERROR, fix overlay text centering'], check=True)
subprocess.run(['git', 'tag', '-d', 'v2.1'], capture_output=True)
subprocess.run(['git', 'tag', 'v2.1'], check=True)
subprocess.run(['git', 'push', 'origin', 'master', '--tags', '--force'], check=True)
print('Done! Committed and pushed v2.1')
