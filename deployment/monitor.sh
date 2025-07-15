#!/bin/bash

# 🔍 Monitoring Script untuk Mubinyx di Hostinger

echo "=== MUBINYX MONITORING SCRIPT ==="
echo "Timestamp: $(date)"
echo

# Check if website is accessible
echo "🌐 Checking website accessibility..."
if curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com | grep -q "200"; then
    echo "✅ Website is accessible"
else
    echo "❌ Website is not accessible"
fi

echo

# Check API endpoint
echo "🔗 Checking API endpoint..."
if curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/api | grep -q "200\|404"; then
    echo "✅ API endpoint is responding"
else
    echo "❌ API endpoint is not responding"
fi

echo

# Check disk usage
echo "💾 Disk usage:"
df -h | grep -E "/$|/home"

echo

# Check memory usage
echo "🧠 Memory usage:"
free -h

echo

# Check recent error logs (last 10 lines)
echo "📋 Recent error logs:"
if [ -f "/home/username/logs/error.log" ]; then
    tail -10 /home/username/logs/error.log
else
    echo "No error log found"
fi

echo

# Check database connection (if possible)
echo "🗄️  Database status:"
if command -v mysql &> /dev/null; then
    mysql -u username -p'password' -e "SELECT 1" database_name &> /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Database connection successful"
    else
        echo "❌ Database connection failed"
    fi
else
    echo "MySQL client not available"
fi

echo

# Check file permissions
echo "🔐 Checking critical file permissions:"
if [ -d "/home/username/public_html" ]; then
    ls -la /home/username/public_html | head -5
else
    echo "Public HTML directory not found"
fi

echo
echo "=== MONITORING COMPLETE ==="

# Optional: Send results to email or logging service
# mail -s "Mubinyx Monitoring Report" admin@yourdomain.com < /tmp/monitoring_report.txt
