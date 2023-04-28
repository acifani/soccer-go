npx ncc build src/index.ts -o dist

node --experimental-sea-config sea-config.json

cp $(command -v node) ./dist/soccer-go

codesign --remove-signature ./dist/soccer-go

npx postject ./dist/soccer-go NODE_SEA_BLOB ./dist/soccer-go.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
    --macho-segment-name NODE_SEA

codesign --sign - ./dist/soccer-go
