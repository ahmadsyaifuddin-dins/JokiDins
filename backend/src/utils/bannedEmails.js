// utils/bannedEmails.js

const bannedEmails = [
    // Basic accounts
    "user@gmail.com", 
    "admin@gmail.com", 
    "test@gmail.com",
    "tester@gmail.com",
    "example@gmail.com",
    "info@gmail.com",
    "support@gmail.com",
    "contact@gmail.com",
    "help@gmail.com",
    "noreply@gmail.com",
    "no-reply@gmail.com",
    "webmaster@gmail.com",
    "administrator@gmail.com",
    "root@gmail.com",
    "guest@gmail.com",
    "anonymous@gmail.com",
    "default@gmail.com",
    "postmaster@gmail.com",
    
    // Temporary or fake emails
    "fake@gmail.com",
    "temp@gmail.com",
    "tempuser@gmail.com",
    "tempmail@gmail.com",
    "sample@gmail.com",
    "demo@gmail.com",
    "testing123@gmail.com",
    "abc@gmail.com",
    "abc123@gmail.com",
    "apcb@gmail.com",
    "soundhoreg@gmail.com",
    "horeg@gmail.com",
    "jokidins@gmail.com",
    "joki-dins@gmail.com",
    "12345@gmail.com",
    "qwerty@gmail.com",
    "qwerty123@gmail.com",
    "password@gmail.com",
    "password123@gmail.com",
    "asdf@gmail.com",
    "system@gmail.com",
    
    // Additional common patterns
    "testuser@gmail.com",
    "dummyuser@gmail.com",
    "dummy@gmail.com",
    "username@gmail.com",
    "email@gmail.com",
    "mail@gmail.com",
    "inbox@gmail.com",
    "myemail@gmail.com",
    "mymail@gmail.com",
    "company@gmail.com",
    "website@gmail.com",
    "hello@gmail.com",
    "hi@gmail.com",
    
    // Numeric patterns
    "123@gmail.com",
    "1234@gmail.com",
    "123456@gmail.com",
    "111111@gmail.com",
    "222222@gmail.com",
    "000000@gmail.com",
    "999999@gmail.com",
    
    // Common names
    "john@gmail.com",
    "jane@gmail.com",
    "johndoe@gmail.com",
    "janedoe@gmail.com",
    "smith@gmail.com",
    "johnson@gmail.com",
    
    // Offensive terms
    "shit@gmail.com",
    "asshole@gmail.com",
    "bitch@gmail.com",
    "idiot@gmail.com",
    "stupid@gmail.com",
    "dick@gmail.com",
    "pussy@gmail.com",
    "cacat@gmail.com",
    "sumbing@gmail.com",
    "bibirsumbing@gmail.com",
    "oranggila@gmail.com",
    
    // Tech related
    "developer@gmail.com",
    "sysadmin@gmail.com",
    "programmer@gmail.com",
    "webdev@gmail.com",
    "coder@gmail.com",
    "tech@gmail.com",
    "database@gmail.com",
    "server@gmail.com",
    
    // Service accounts
    "service@gmail.com",
    "services@gmail.com",
    "billing@gmail.com",
    "account@gmail.com",
    "accounts@gmail.com",
    "subscribe@gmail.com",
    "subscribe@gmail.com",
    "newsletter@gmail.com",
    "sales@gmail.com",
    "marketing@gmail.com",
    
    // Security related
    "security@gmail.com",
    "secure@gmail.com",
    "privacy@gmail.com",
    "backup@gmail.com",
    "recovery@gmail.com",
    "reset@gmail.com",
    "password.reset@gmail.com",
    "verification@gmail.com",
    "verify@gmail.com",
    
    // Common first names
    "michael@gmail.com",
    "david@gmail.com",
    "james@gmail.com",
    "robert@gmail.com",
    "maria@gmail.com",
    "jennifer@gmail.com",
    "mary@gmail.com",
    "patricia@gmail.com",
    
    // Random combinations
    "test123@gmail.com",
    "user1@gmail.com",
    "user123@gmail.com",
    "admin123@gmail.com",
    "random@gmail.com",
    "throwaway@gmail.com",
    "temporary@gmail.com",
    "onetime@gmail.com",
    "notreal@gmail.com",
    "fakeemail@gmail.com",
    "norealemail@gmail.com",
    "trash@gmail.com",
    "junk@gmail.com",
    "spam@gmail.com",

     // Extended test/variants
     "test1@gmail.com",
     "test2@gmail.com.com",
     "testtest@gmail.com",
     "testingaccount@gmail.com",
     "qa@gmail.com",
     "qualityassurance@gmail.com",
     
     // Tech/IT expansions
     "devops@gmail.com",
     "frontend@gmail.com",
     "backend@gmail.com",
     "fullstack@gmail.com",
     "cloud@gmail.com",
     "serverless@gmail.com",
     "api@gmail.com",
     "debug@gmail.com",
     
     // Corporate roles
     "ceo@gmail.com",
     "cto@gmail.com",
     "founder@gmail.com",
     "manager@gmail.com",
     "hr@gmail.com",
     "finance@gmail.com",
     "accounting@gmail.com",
     "customer.service@gmail.com",
     
     // Security expansions
     "phishing@gmail.com",
     "malware@gmail.com",
     "firewall@gmail.com",
     "antivirus@gmail.com",
     "encryption@gmail.com",
     
     // Numerical patterns
     "1111@gmail.com",
     "2222@gmail.com",
     "3333@gmail.com",
     "4444@gmail.com",
     "123456789@gmail.com",
     "00000@gmail.com",
     
     // Keyboard patterns
     "qweasd@gmail.com",
     "zxcvbn@gmail.com",
     "poiuyt@gmail.com",
     
     // Placeholder terms
     "placeholder@gmail.com",
     "dummyaccount@gmail.com",
     "generica@gmail.com",
     "void@gmail.com",
     "invalidemail@gmail.com",
     
     // Service/Support
     "refund@gmail.com",
     "invoice@gmail.com",
     "payment@gmail.com",
     "complaints@gmail.com",
     
     // Temporary/Disposable
     "throwaway123@gmail.com",
     "disposable@gmail.com",
     "10minutemail@gmail.com",
     
     // Gaming/Social
     "gamer@gmail.com",
     "streamer@gmail.com",
     "tweet@gmail.com",
     "instagramtest@gmail.com",
     
     // Language-specific
     "usuario@gmail.com",  // Spanish
     "anonyme@gmail.com",  // French
     "benutzer@gmail.com", // German
     
     // Misspellings
     "adm1n@gmail.com",
     "ro0t@gmail.com",
     
     // Additional offensive
     "bastard@gmail.com",
     "crap@gmail.com",
     "loser@gmail.com",
     "fuck@gmail.com",
     "anjing@gmail.com",
     "babi@gmail.com",
     "taikucing@gmail.com",
     
     // Environment-related
     "staging@gmail.com",
     "sandbox@gmail.com",
     "preprod@gmail.com",
     
     // Automation
     "bot@gmail.com",
     "automated@gmail.com",
     "script@gmail.com"
  ];
  
  module.exports = bannedEmails;