import urllib.request, os, sys

base = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/'
files = {
    'EffectComposer.js': base + 'effects/EffectComposer.js',
    'ShaderPass.js': base + 'postprocessing/ShaderPass.js',
    'GammaCorrectionShader.js': base + 'shaders/GammaCorrectionShader.js',
}

d = 'C:/temp/ling/tetris'
for name, url in files.items():
    try:
        urllib.request.urlretrieve(url, os.path.join(d, name))
        size = os.path.getsize(os.path.join(d, name))
        print(f'{name}: {size} bytes')
    except Exception as e:
        print(f'{name}: FAILED - {e}')

# List all JS files
print('\nAll JS files:')
for f in sorted(os.listdir(d)):
    if f.endswith('.js'):
        size = os.path.getsize(os.path.join(d, f))
        print(f'  {f}: {size} bytes')
