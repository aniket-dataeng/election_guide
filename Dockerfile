FROM nginx:alpine
# Copy the static website files to the nginx default public folder
COPY . /usr/share/nginx/html

# Expose port 8080 because Cloud Run expects port 8080 by default
EXPOSE 8080

# Overwrite the nginx default config to listen on port 8080 instead of 80
CMD ["/bin/sh", "-c", "sed -i 's/listen  \\[::\\]:80;/listen \\[::\\]:8080;/g' /etc/nginx/conf.d/default.conf && sed -i 's/listen       80;/listen 8080;/g' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
