# adam-harper.com

This is the source for [adam-harper.com](https://adam-harper.com), a personal/professional site built with [Zola](https://www.getzola.org/).

## Features
- Fast, static site generated with Zola
- Custom domain: [adam-harper.com](https://adam-harper.com)
- Deployed via Cloudflare Pages
- All assets and content managed in this repository
- Modern, responsive design with externalized CSS

## Local Development

1. Install [mise](https://mise.jdx.dev/) (if not already installed)
2. Run `mise install` to install the correct Zola version (as specified in `mise.toml`)
3. Start the local server:

    ```sh
    zola serve
    ```
4. Visit [http://127.0.0.1:1111](http://127.0.0.1:1111) to preview the site

## Deployment

Deployments are handled automatically via Cloudflare Pages. Preview branch builds are available via sub-domains of `adam-harper-com.pages.dev`. The `main` branch builds and deploys to the sites' custom domain and https://adam-harper-com.pages.dev/

## Structure
- `content/` — Markdown content (homepage, articles, links, etc.)
- `templates/` — Zola templates (base, index, 404, etc.)
- `static/` — Static assets (images, CSS, favicons, CV)
- `config.toml` — Zola configuration
- `mise.toml` — Tool version management

## Domain & Hosting
- **Domain:** Managed via Cloudflare DNS
- **Hosting:** Served by Cloudflare Pages
- **SSL:** Automatic via Cloudflare

## License

All content © Adam Harper. Code and configuration MIT licensed unless otherwise noted.
