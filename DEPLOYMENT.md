# Deployment Guide for Kariua Parish Website

This guide covers deploying the Kariua Parish website on Render and VPS platforms.

## Prerequisites

Before deploying, ensure you have the following environment variables ready:

- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for chat assistant
- `TELEGRAM_BOT_TOKEN` - Telegram bot token for prayer requests
- `TELEGRAM_CHAT_ID` - Telegram chat ID where prayer requests will be sent
- `YOUTUBE_API_KEY` - YouTube Data API v3 key (if using music features)
- `NODE_ENV` - Set to `production`

## Deploy to Render

Render provides easy, automated deployments with built-in PostgreSQL support.

### Step 1: Connect Your Repository

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub/GitLab repository
4. Select the repository containing this project

### Step 2: Configure the Service

Render will auto-detect the `render.yaml` configuration file. Verify these settings:

- **Name:** kariua-parish
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** Free (or upgrade as needed)

### Step 3: Add Environment Variables

In the Render dashboard, add all environment variables:

1. Go to your service's "Environment" tab
2. Add each secret listed in Prerequisites
3. For DATABASE_URL, Render will provide this automatically if you create a PostgreSQL database

### Step 4: Create PostgreSQL Database

1. In Render dashboard, click "New +" and select "PostgreSQL"
2. Name it `kariua-parish-db`
3. Select the Free plan
4. Once created, copy the "Internal Database URL"
5. Add it as `DATABASE_URL` in your web service environment variables

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically deploy your application
3. Wait for the build to complete (usually 3-5 minutes)
4. Access your site at the provided Render URL (e.g., `https://kariua-parish.onrender.com`)

### Step 6: Push Database Schema

After first deployment, you need to create the database tables:

1. Go to your service's "Shell" tab in Render
2. Run: `npm run db:push`
3. This creates all necessary database tables

### Health Check

Render will automatically monitor `/api/health` endpoint to ensure your application is running.

---

## Deploy to VPS (Ubuntu/Debian)

For self-hosted deployment on a Virtual Private Server.

### Step 1: Server Setup

1. **Update system packages:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js (v20 recommended):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Install PostgreSQL:**
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   ```

4. **Install Nginx (for reverse proxy):**
   ```bash
   sudo apt install -y nginx
   ```

5. **Install PM2 (process manager):**
   ```bash
   sudo npm install -g pm2
   ```

### Step 2: Database Setup

1. **Create PostgreSQL database and user:**
   ```bash
   sudo -u postgres psql
   ```
   
   ```sql
   CREATE DATABASE kariua_parish;
   CREATE USER kariua_admin WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE kariua_parish TO kariua_admin;
   \q
   ```

2. **Get your DATABASE_URL:**
   ```
   postgresql://kariua_admin:your_secure_password@localhost:5432/kariua_parish
   ```

### Step 3: Deploy Application

1. **Clone your repository:**
   ```bash
   cd /var/www
   sudo git clone https://github.com/yourusername/kariua-parish.git
   cd kariua-parish
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   sudo nano .env
   ```
   
   Add your environment variables:
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://kariua_admin:your_secure_password@localhost:5432/kariua_parish
   OPENAI_API_KEY=your_openai_key
   TELEGRAM_BOT_TOKEN=your_telegram_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   YOUTUBE_API_KEY=your_youtube_key
   PORT=3000
   ```

4. **Build the application:**
   ```bash
   npm run build
   ```

5. **Push database schema:**
   ```bash
   npm run db:push
   ```

6. **Start with PM2:**
   ```bash
   pm2 start npm --name "kariua-parish" -- start
   pm2 save
   pm2 startup
   ```
   
   Follow the command output to enable PM2 startup on boot.

### Step 4: Configure Nginx Reverse Proxy

1. **Create Nginx configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/kariua-parish
   ```

2. **Add this configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/kariua-parish /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 5: Setup SSL with Let's Encrypt (Recommended)

1. **Install Certbot:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Follow the prompts to complete SSL setup**

4. **Auto-renewal is configured automatically**

### Step 6: Firewall Configuration

1. **Allow necessary ports:**
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

---

## Post-Deployment Checklist

After deployment on either platform:

- [ ] Verify website is accessible
- [ ] Test OpenAI chat assistant functionality
- [ ] Submit a test prayer request and verify Telegram delivery
- [ ] Check all pages load correctly (Home, Music, Prayers, Intentions)
- [ ] Test responsive design on mobile devices
- [ ] Monitor application logs for errors
- [ ] Set up database backups (crucial for production)

## Monitoring & Maintenance

### Render
- Use Render Dashboard to view logs
- Set up email/Slack notifications for deployment failures
- Monitor usage under "Metrics" tab

### VPS
- **View PM2 logs:**
  ```bash
  pm2 logs kariua-parish
  ```

- **Restart application:**
  ```bash
  pm2 restart kariua-parish
  ```

- **Monitor resources:**
  ```bash
  pm2 monit
  ```

- **Database backups:**
  ```bash
  # Create backup
  pg_dump kariua_parish > backup_$(date +%Y%m%d).sql
  
  # Restore from backup
  psql kariua_parish < backup_file.sql
  ```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correctly formatted
- Check database user has proper permissions
- Ensure database server is running

### Chat Assistant Not Working
- Verify `OPENAI_API_KEY` is valid and has credits
- Check API endpoint logs for specific error messages

### Telegram Notifications Not Sending
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are correct
- Start a conversation with your bot before testing
- Check bot has permission to send messages

### Application Won't Start
- Check all required environment variables are set
- Review application logs for specific errors
- Ensure Node.js version is 18 or higher

## Support

For deployment issues specific to this application:
- Check application logs first
- Verify all environment variables are correctly set
- Test the health check endpoint: `https://your-domain.com/api/health`

For platform-specific issues:
- Render: https://render.com/docs
- Nginx: https://nginx.org/en/docs/
- PM2: https://pm2.keymetrics.io/docs/
