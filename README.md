# Uddipt Shankar — Portfolio

A responsive personal portfolio focused on applied AI/ML and cybersecurity. The original three-page navigation (About, Resume, Projects), project filtering, GitHub repository loading, resume download and contact form are retained with a refreshed visual system.

## Run locally

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open `http://localhost:5000`.

## Deployment

- **Render:** the included `render.yaml` runs the Flask app with Gunicorn and a persistent disk for the SQLite database.
- **Netlify:** the included `netlify.toml` publishes `static/` as a static site. The contact form opens a prefilled email draft; visitors must send it from their email application.

## Updating your résumé and credentials

- Replace `static/assets/resume.pdf` with your latest verified résumé whenever experience or skills change.
- Add internship completion certificates only after supplying the actual PDFs or public verification URLs. Keep them in a dedicated credentials area and link each item to the original document or verification page.
- Review all dates, certification URLs, deployment links and project metrics before publishing.

## Notes

- `portfolio.db` is intentionally not included in the refreshed source ZIP. The Flask app creates its SQLite database at startup based on `DB_PATH`.
- Contact submissions are not exposed through a public listing endpoint.
