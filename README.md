# delottie

delottie is small CLI tool to manipulate .lottie animation files. It can remove watermarks and
create simple dotLottie files.

## Usage

```bash
npx delottie -c -z some-lottie.json other-lottie.json
```

This will clean the two lottie files (remove watermarks) and create two `*-clean.json` files.
It will then create two separate dotLottie files `*.lottie`. You can use `-o / --overwrite` to overwrite
the original `.json` file instead of appending `-clean`.

## License

This code is licensed under the MIT License.
