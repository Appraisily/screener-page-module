@@ .. @@
 // CORS configuration
 const allowedOrigins = [
   'http://localhost:5173',
-  'https://appraisily-screener.netlify.app',
+  'https://melodious-cucurucho-af6d21.netlify.app',
   'https://screener.appraisily.com',
+  /^https:\/\/[a-z0-9-]+\.netlify\.app$/,
   /^https:\/\/[a-z0-9-]+-[a-z0-9]+-[a-z0-9]+\.preview\.app\.github\.dev$/,
   /^https:\/\/[a-z0-9-]+-[a-z0-9]+-[a-z0-9]+\.stackblitz\.io$/,
   /^https:\/\/[a-z0-9-]+--\d+\.local-credentialless\.webcontainer\.io$/
 ];

 app.use(cors({
   origin: function(origin, callback) {
-    if (!origin) return callback(null, true);
+    // Allow requests with no origin (like mobile apps or curl requests)
+    if (!origin) {
+      return callback(null, true);
+    }
     
     const isAllowed = allowedOrigins.some(allowed => {
       if (allowed instanceof RegExp) {
         return allowed.test(origin);
       }
       return allowed === origin;
     });

     if (isAllowed) {
       callback(null, true);
     } else {
+      console.log(`Origin ${origin} not allowed by CORS`);
       callback(new Error('Not allowed by CORS'));
     }
   },
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true,
   maxAge: 86400
 }))