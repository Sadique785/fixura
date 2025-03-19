# Fixura

Fixura is a web application that provides a seamless experience for users. This README provides setup instructions for local development, production deployment, and troubleshooting.

## Live Application
- **Frontend**: [Fixura Frontend](https://fixura.vercel.app)
- **Backend**: [Fixura Backend](https://fixura.devque.live)
- **API Documentation**: [Postman API Docs](https://documenter.getpostman.com/view/43104913/2sAYkBsLum)

## Local Development Setup
### Prerequisites
- Python 3.12+
- Node.js & npm
- PostgreSQL
- Virtual Environment (venv)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/fixura.git
   cd fixura/Backend/fixura
   ```
2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up the environment variables (`.env` file):
   ```env
   DB_NAME=your_db
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   SECRET_KEY=your_secret_key
   ```
5. Apply migrations and run the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../../Frontend/fixura
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Production Deployment
### Backend Deployment
The backend is hosted at **fixura.devque.live** using:
- **Gunicorn** as the WSGI server
- **Nginx** as the reverse proxy
- **PostgreSQL** as the database

#### Gunicorn Service and Socket Configuration
- **`/etc/systemd/system/gunicorn.service`**
  ```ini
  [Unit]
  Description=gunicorn daemon
  Requires=gunicorn.socket
  After=network.target

  [Service]
  User=ubuntu
  Group=www-data
  WorkingDirectory=/home/ubuntu/fixura/Backend/fixura
  ExecStart=/home/ubuntu/fixura/Backend/venv/bin/gunicorn \
            --access-logfile - \
            --workers 3 \
            --bind unix:/run/gunicorn.sock \
            fixura.wsgi:application

  [Install]
  WantedBy=multi-user.target
  ```
- **`/etc/systemd/system/gunicorn.socket`**
  ```ini
  [Unit]
  Description=gunicorn socket

  [Socket]
  ListenStream=/run/gunicorn.sock

  [Install]
  WantedBy=sockets.target
  ```
- Restart Gunicorn after changes:
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl restart gunicorn
  ```

### Nginx Configuration
The backend is proxied through **Nginx**, with SSL enabled via **Let's Encrypt**:
- **`/etc/nginx/sites-available/fixura`**
  ```nginx
  server {
      server_name fixura.devque.live;

      location = /favicon.ico {
          access_log off;
          log_not_found off;
      }

      location /static/ {
          alias /home/ubuntu/fixura/Backend/fixura/staticfiles/;
      }

      location /media/ {
          alias /home/ubuntu/fixura/Backend/fixura/media/;
      }

      location / {
          include proxy_params;
          proxy_pass http://unix:/run/gunicorn.sock;
          proxy_set_header X-Real-IP $remote_addr;
      }

      listen 443 ssl;
      ssl_certificate /etc/letsencrypt/live/fixura.devque.live/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/fixura.devque.live/privkey.pem;
      include /etc/letsencrypt/options-ssl-nginx.conf;
  }

  server {
      if ($host = fixura.devque.live) {
          return 301 https://$host$request_uri;
      }

      listen 80;
      server_name fixura.devque.live;
      return 404;
  }
  ```
- Test and restart Nginx:
  ```bash
  sudo nginx -t
  sudo systemctl restart nginx
  ```

### Frontend Deployment
The frontend is hosted on **Vercel** at [Fixura Frontend](https://fixura.vercel.app).
To deploy updates:
```bash
vercel deploy
```

## Troubleshooting
- **Check Nginx logs:**
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
- **Check Gunicorn logs:**
  ```bash
  sudo journalctl -u gunicorn --no-pager
  ```
- **Restart services:**
  ```bash
  sudo systemctl restart gunicorn nginx
  ```

## API Documentation
For API endpoints, refer to the **[Postman API Docs](https://documenter.getpostman.com/view/43104913/2sAYkBsLum)**.

---

This README provides all necessary details for setting up, deploying, and troubleshooting Fixura. 🚀

