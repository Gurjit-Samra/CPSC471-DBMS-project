-- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: techstore
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_accessory`
--

DROP TABLE IF EXISTS `api_accessory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_accessory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_accessory`
--

LOCK TABLES `api_accessory` WRITE;
/*!40000 ALTER TABLE `api_accessory` DISABLE KEYS */;
INSERT INTO `api_accessory` VALUES (1,'SteelSeries Arctis Nova Pro Wireless','Dual wireless system: connect via 2.4GHz and Bluetooth simultaneously\r\n\r\nActive Noise Cancellation + Transparency Mode\r\n\r\nHot-swappable dual battery system for uninterrupted play\r\n\r\nHigh-fidelity audio with Sonar software suite for 360° spatial sound\r\n\r\nMulti-platform support: PC, PS5, PS4, and more',349.99,'SteelSeries','product_images/SteelSeries_Arctis_Nova_Pro_Wireless.jpg'),(2,'Xbox Elite Wireless Controller Series 2','Adjustable-tension thumbsticks and shorter hair trigger locks\r\n\r\nSwappable thumbsticks, D-pads, and paddles for customization\r\n\r\nUp to 40 hours of battery life per charge\r\n\r\nFully remappable buttons with Xbox Accessories app\r\n\r\nCompatible with Xbox Series X|S, Xbox One, and Windows',179.99,'Microsoft','product_images/Xbox_Elite_Wireless_Controller_Series_2.jpg'),(3,'Sony DualSense Edge Wireless Controller','Customizable back buttons and adjustable trigger sensitivity\r\n\r\nInterchangeable stick modules and profiles for pro-level control\r\n\r\nBuilt-in microphone and adaptive triggers with haptic feedback\r\n\r\nPremium case with USB braided cable and multiple swappable parts\r\n\r\nFully compatible with PS5 and PC',199.99,'Sony','product_images/Sony_DualSense_Edge_Wireless_Controller.jpg'),(4,'Razer Iskur Gaming Chair','Ergonomic lumbar support system designed for extended play\r\n\r\nMulti-layered synthetic leather with high-density foam cushioning\r\n\r\n4D adjustable armrests and steel-reinforced body\r\n\r\nDesigned for optimal posture during gaming sessions',499.99,'Razer','product_images/Razer_Iskur_Gaming_Chair.jpg');
/*!40000 ALTER TABLE `api_accessory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_console`
--

DROP TABLE IF EXISTS `api_console`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_console` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_console`
--

LOCK TABLES `api_console` WRITE;
/*!40000 ALTER TABLE `api_console` DISABLE KEYS */;
INSERT INTO `api_console` VALUES (1,'PlayStation 5','Sony’s latest console with ultra-fast SSD, stunning graphics, and immersive DualSense controller.',499.99,'Sony','product_images/ps5.jpg'),(2,'PlayStation 5 Digital Edition','A disc-less version of the PS5 with all the same performance in a sleeker form factor.',449.99,'Sony','product_images/ps5_digital.jpg'),(3,'Xbox Series X','Microsoft’s most powerful console yet, delivering 4K gaming, fast load times, and Game Pass support.',499.99,'Microsoft','product_images/xbox_series_x.jpg'),(4,'Xbox Series S','A compact, all-digital console offering next-gen speed and performance at a lower price.',299.99,'Microsoft','product_images/xbox_series_s.jpg'),(5,'Nintendo Switch OLED','Hybrid console with a vibrant OLED screen, improved audio, and enhanced kickstand.',349.99,'Nintendo','product_images/nintendo_swtich_oled.jpg'),(6,'Steam Deck OLED (1TB)','Valve’s handheld gaming PC with an OLED screen, custom AMD APU, and access to your entire Steam library.',649.00,'Valve','product_images/steam_deck_oled.jpg');
/*!40000 ALTER TABLE `api_console` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_customer`
--

DROP TABLE IF EXISTS `api_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_customer` (
  `user_ptr_id` varchar(254) NOT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  PRIMARY KEY (`user_ptr_id`),
  CONSTRAINT `api_customer_user_ptr_id_99e2c097_fk_api_user_email` FOREIGN KEY (`user_ptr_id`) REFERENCES `api_user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_customer`
--

LOCK TABLES `api_customer` WRITE;
/*!40000 ALTER TABLE `api_customer` DISABLE KEYS */;
INSERT INTO `api_customer` VALUES ('emperor@elba.fr','France','Paris','Île-de-France','75001','1 Imperial Avenue'),('john.pork@gmail.com','Canada','Calgary','Alberta','PPPOOO','69 Porkchop Avenue Hill EW'),('jstatham@toughmail.uk','United Kingdom','London','England','SW1A 1AA','12 Crank Drive'),('kinghenryv@houseoflancaster.uk','England','London','Greater London','W1A 1AA','1 Crown Lane'),('muadib@arrakis.com','Arrakis','Arrakeen','Dune Province','00001','101 Sietch Tabr Way'),('pbusiness@pierceandpierce.nyc','USA','Manhattan','New York','10005','358 Exchange Place'),('queen@dragonstone.essos','Essos','Meereen','Bay of Dragons','00007','1 Dragonstone Keep'),('vader@empire.gov','Galaxy Far Far Away','Imperial City','Outer Rim','1138','1 Death Star Blvd'),('why_so_serious@chaosmail.com','USA','Gotham City','New Jersey','000000','1 HaHa Lane');
/*!40000 ALTER TABLE `api_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_laptop`
--

DROP TABLE IF EXISTS `api_laptop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_laptop` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `ram` int unsigned NOT NULL,
  `graphics_card` varchar(255) NOT NULL,
  `proccessor` varchar(255) NOT NULL,
  `screen_size` int unsigned NOT NULL,
  `resolution` varchar(10) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `api_laptop_chk_1` CHECK ((`ram` >= 0)),
  CONSTRAINT `api_laptop_chk_2` CHECK ((`screen_size` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_laptop`
--

LOCK TABLES `api_laptop` WRITE;
/*!40000 ALTER TABLE `api_laptop` DISABLE KEYS */;
INSERT INTO `api_laptop` VALUES (1,'MacBook Pro 16-inch (M3 Max)','SUPERCHARGED BY M3 PRO OR M3 MAX—The Apple M3 Pro chip, with a 12-core CPU and 18-core GPU using hardware-accelerated ray tracing, delivers amazing performance for demanding workflows like manipulating gigapixel panoramas or compiling millions of lines of code. M3 Max, with an up to 16-core CPU and up to 40-core GPU, drives extreme performance for the most advanced workflows like rendering intricate 3D content or developing transformer models with billions of parameters.\r\nBUILT FOR APPLE INTELLIGENCE — Apple Intelligence helps you write, express yourself, and get things done effortlessly. It draws on your personal context while setting a brand-new standard for privacy in AI. Coming in beta in U.S. English later this year.\r\nUP TO 22 HOURS OF BATTERY LIFE—Go all day thanks to the power-efficient design of Apple silicon. MacBook Pro delivers the same exceptional performance whether it’s running on battery or plugged in.',3499.00,64,'Apple 40-core GPU','Apple M3 Max',16,'3456x2234','product_images/MacBook_Pro_16-inch_M3_Max.jpeg','Apple'),(2,'Dell XPS 16 (2024)','Ultra-premium Windows laptop with Intel Core Ultra 9, RTX 4070, and InfinityEdge OLED display.',2899.00,32,'NVIDIA RTX 4070','Intel Core Ultra 9 185H',16,'3840x2400','product_images/Dell_XPS_16_2024.jpg','Dell'),(3,'Razer Blade 16 (2024)','Gaming powerhouse with Mini-LED dual-mode display, perfect for both creatives and gamers.',3199.00,32,'NVIDIA RTX 4090','Intel Core i9-14900HX',16,'3840x2400','product_images/Razer_Blade_16_2024.jpg','Razer'),(4,'HP Spectre x360 14 (2024)','Sleek 2-in-1 with OLED touchscreen, excellent portability, and long battery life.',1699.00,16,'Intel Iris Xe','Intel Core Ultra 7 155H',14,'3000x2000','product_images/HP_Spectre_x360_14_2024.jpg','HP'),(5,'ASUS ROG Zephyrus G14 (2024)','Ultra-portable gaming laptop with AMD Ryzen 9 and RTX 4070, in a sleek magnesium alloy chassis.',1999.00,32,'NVIDIA RTX 4070','AMD Ryzen 9 8945HS',14,'2560x1600','product_images/ASUS_ROG_Zephyrus_G14_2024.png','Asus');
/*!40000 ALTER TABLE `api_laptop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_pc`
--

DROP TABLE IF EXISTS `api_pc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_pc` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `ram` int unsigned NOT NULL,
  `graphics_card` varchar(255) NOT NULL,
  `proccessor` varchar(255) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `api_pc_chk_1` CHECK ((`ram` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_pc`
--

LOCK TABLES `api_pc` WRITE;
/*!40000 ALTER TABLE `api_pc` DISABLE KEYS */;
INSERT INTO `api_pc` VALUES (1,'HydraX Xtreme RTX Edition','The HydraX Xtreme RTX Edition is a no-compromise desktop engineered for the elite gamer, the relentless creator, and the uncompromising perfectionist. Clad in a tempered glass and matte-black aluminum case, it pulses with synchronized RGB lighting like a living, breathing entity. Inside, it boasts the latest components — bleeding-edge tech cooled by a custom triple-loop liquid cooling system. This is a machine that doesn’t flinch under pressure, whether you’re rendering 8K footage, compiling massive codebases, or crushing 360 fps in competitive shooters. Every inch of its architecture is tuned for silence, speed, and stunning visual performance. It doesn’t just run your world — it rules it.',4999.00,128,'NVIDIA GeForce RTX 4090 24GB GDDR6X','Intel Core i9-14900KS 6.2GHz','product_images/HydraX_Xtreme_RTX_Edition.png','HydraX Systems');
/*!40000 ALTER TABLE `api_pc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_phone`
--

DROP TABLE IF EXISTS `api_phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_phone` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `screen_size` int unsigned NOT NULL,
  `resolution` varchar(10) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `api_phone_chk_1` CHECK ((`screen_size` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_phone`
--

LOCK TABLES `api_phone` WRITE;
/*!40000 ALTER TABLE `api_phone` DISABLE KEYS */;
INSERT INTO `api_phone` VALUES (1,'iPhone 15 Pro Max','Apple’s flagship with the A17 Pro chip, titanium design, and ProMotion OLED display.',1199.00,7,'2796x1290','product_images/iphone_15_pro_max_1.jpg','Apple'),(2,'Samsung Galaxy S24 Ultra','Samsung’s latest with Snapdragon 8 Gen 3, S Pen support, and a 200MP camera.',1299.99,7,'3088x1440','product_images/samsung_galaxy_s24_ultra_1.jpg','Samsung'),(3,'Google Pixel 8 Pro','Pixel’s AI-powered smartphone with Tensor G3, great camera software, and a smooth OLED screen.',999.00,7,'2992x1344','product_images/google_pixel_8_pro_1.jpg','Google'),(4,'OnePlus 12','Flagship killer with Snapdragon 8 Gen 3, fast charging, and a 120Hz AMOLED display.',799.00,7,'3168x1440','product_images/oneplus_12_1.png','OnePlus'),(5,'Xiaomi 14 Pro','Premium build, Leica-tuned cameras, and Snapdragon 8 Gen 3 under the hood.',899.00,7,'3200x1440','product_images/xiaomi_14_pro_1.jpg','Xiaomi'),(6,'Sony Xperia 1 VI','A flagship for creatives with a 4K OLED display, pro-grade camera tools, and Snapdragon 8 Gen 3.',1199.00,6,'3840x1644','product_images/sony_xperia_1_vi.jpg','Sony');
/*!40000 ALTER TABLE `api_phone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_review`
--

DROP TABLE IF EXISTS `api_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `review_text` longtext NOT NULL,
  `rating` int NOT NULL,
  `product_type` varchar(30) NOT NULL,
  `product_id` int unsigned NOT NULL,
  `customer_id` varchar(254) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `api_review_customer_id_683cc727_fk_api_customer_user_ptr_id` (`customer_id`),
  CONSTRAINT `api_review_customer_id_683cc727_fk_api_customer_user_ptr_id` FOREIGN KEY (`customer_id`) REFERENCES `api_customer` (`user_ptr_id`),
  CONSTRAINT `api_review_chk_1` CHECK ((`product_id` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_review`
--

LOCK TABLES `api_review` WRITE;
/*!40000 ALTER TABLE `api_review` DISABLE KEYS */;
INSERT INTO `api_review` VALUES (2,'Looks sleek, runs fast — just like me when someone FaceTimes. But bro, the fan kicked in like it was trying to take off. Not cool. Literally.',3,'laptop',2,'john.pork@gmail.com'),(4,'Elegant, precise, and powerful — a machine worthy of a mentat. Its silence is a virtue, its display a window to unseen futures. But beware: it grows hot, like the dunes at noon.',4,'laptop',2,'muadib@arrakis.com'),(5,'It moves with the stillness of a Fremen blade — silent, exact, unwavering. The M3 Max is not a chip; it is prescience in silicon. This is no machine. It is a tool of prophecy.',5,'laptop',1,'muadib@arrakis.com'),(6,'A lonely journey through desolation and silence… yet somehow, I felt understood. The burden of connection, the weight of destiny — it is not a game. It is a vision. I saw sand, but I felt rain.',5,'video_game',1,'muadib@arrakis.com'),(7,'Pretty good but the fingerprint sensor isn\'t ultrasonic',4,'phone',3,'john.pork@gmail.com'),(8,'Impressive. Most impressive. The camera quality rivals even Imperial surveillance. But it lacks a dark mode… truly dark.',4,'phone',1,'vader@empire.gov'),(9,'The power is insignificant compared to the flagship. The UI is cluttered, the ads are... disturbing. I find your lack of polish disappointing.',2,'phone',5,'vader@empire.gov'),(10,'A marvel fit for a sovereign. Swift as a charger at Agincourt, and twice as sharp. I FaceTime my nobles with nary a hitch.',5,'phone',1,'kinghenryv@houseoflancaster.uk'),(11,'Excellent entertainment for weary knights. The controller, however, is too small for hands that once gripped a sword.',4,'console',1,'kinghenryv@houseoflancaster.uk'),(12,'This machine is mighty. Were it present at Harfleur, the walls would have crumbled at its rendering speed alone.',5,'laptop',1,'kinghenryv@houseoflancaster.uk'),(13,'Valiant attempt, yet lacks refinement. A noble squire, not yet a knight.',3,'phone',5,'kinghenryv@houseoflancaster.uk'),(14,'A curious device! Portable and potent — ideal for campaign travels. Still, the fan doth make quite the noise.',4,'console',6,'kinghenryv@houseoflancaster.uk'),(15,'Bro. I charged it for hours — HOURS — and it still died on me mid–Mario Kart. The Joy-Cons drift like they’re trying to run away from responsibility. This ain’t portable gaming, it’s portable pain. Fix it, Nintendo.',1,'console',5,'john.pork@gmail.com'),(16,'A masterstroke of engineering — swift, elegant, and ruthlessly efficient. Much like my campaign across Europe, it conquers all with ease. I dictate my legacy from this device.',5,'phone',1,'emperor@elba.fr'),(17,'Powerful, yes. Refined, no. Like many generals I\'ve outwitted, it boasts strength but lacks charisma. Still, it earns my respect — barely.',4,'laptop',2,'emperor@elba.fr'),(18,'A child\'s toy masquerading as innovation. The display is vivid, yet the controls feel like they were designed for peasants. I did not cross the Alps for this.',2,'console',5,'emperor@elba.fr'),(19,'Mon Dieu. I find myself in rare agreement with a pig in a hoodie. John Pork, your fury is justified, though your language lacks tact. The Switch is unfit for campaign or leisure. I suggest we storm Kyoto together.',1,'console',5,'emperor@elba.fr'),(20,'It’s... exquisite. The titanium frame is cold, immaculate. 200 megapixels — absurd, yet necessary. I used it to take a photo of my business card. Crisp. Perfection.',5,'phone',2,'pbusiness@pierceandpierce.nyc'),(21,'It tries too hard. 4K on a phone? That’s like wearing a Valentino suit to the gym. Respectable on paper, but in practice? Unbalanced. There’s no identity.',3,'phone',6,'pbusiness@pierceandpierce.nyc'),(22,'It’s a black monolith. Sleek. Minimal. Powerful. I appreciate that. The performance is excellent — almost clinical. Still, I prefer physical media. It has… texture.',4,'console',3,'pbusiness@pierceandpierce.nyc'),(23,'Raw, brutal, and surprisingly emotional. Kratos reminds me of someone. The violence is poetic — deliberate. Controlled. Like a perfect morning routine… or a sharpened axe.',5,'video_game',2,'pbusiness@pierceandpierce.nyc'),(24,'Ohhhhhhhhhh the DIGITAL edition. No disc. No plastic. Just pure, unfiltered code. Ones and zeroes, dancing around in their cold, lifeless ballet while I sit here — controller in hand — pretending this isn’t all just some beautiful, high-resolution illusion.\n\nYou know what I miss, Sony? I miss the click. The snap. The theatrical little drama of inserting a disc — of physically committing to madness. But no, not here. The Digital Edition is clean. Sterile. Sanitized. It’s like Arkham’s therapy sessions: all smooth walls and no sharp corners. Nothing to hold onto. Nothing to bite.\n\nThey say it’s the same as the standard PS5, just without the disc. HAHAHA! Sure, and I’m just a \"funny man with makeup.\" No — it’s more than that. It’s philosophy. It’s trusting a corporation to cradle your fragile little childhood in their cloud. It’s giving up control and calling it progress. You don’t own your games anymore, darling — you’re just renting smiles from the void.\n\nAnd don’t get me started on storage. 667 GB usable space? What am I supposed to do, install one game and just stare at the menu screen laughing for 30 hours? Wait… actually… I did do that. But that’s beside the point!\n\nThe console is quiet, yes. Fast? Sure. It’s a marvel. But it’s also a mirror — and when I look into it, I don’t see me. I see you. The consumer. Numb. Clicking. Subscribing. Forever downloading happiness like it’s just another patch update.\n\nSo yes, dear Sony, thank you for your gleaming white coffin of convenience. I laugh not because it’s funny… but because it’s all so very digital.\n\nHAHAHAHAHAHAHAHAHAHA—',2,'console',2,'why_so_serious@chaosmail.com'),(25,'he Razer Blade 16 is no mere machine. It is a weapon, forged not in fire but in precision — sleek, sharp, and unrelentingly powerful. From the moment I laid my eyes upon its obsidian shell, I knew this was a device worthy of a queen.\n\nIts display is breathtaking. The dual-mode Mini-LED screen sings with color — vibrant as the banners of the Great Houses, shifting seamlessly between creative clarity and gaming ferocity. One moment I am overseeing the rise of my empire in 4K, the next I am razing cities in 240Hz — and not once does the screen falter. It does not kneel.\n\nAnd the internals — dracarys. The Intel i9 and RTX 4090 tear through my commands like Drogon through a fleet of slavers. There is no lag, no hesitation, no mercy. Everything yields. The fans roar beneath the metal, not unlike my dragons once did, but never in rebellion — only in loyalty, only in service.\n\nI have seen many machines built for conquest, but few that walk such a line between elegance and devastation. The Razer Blade is not adorned in gaudy excess; its beauty lies in restraint — in knowing its own strength and choosing when to wield it.\n\nYet, no crown is without weight. The heat, like the fire of my children, must be respected. The cost is high — as all thrones are. And the battery, while respectable, is not eternal. Even queens must return to their charger.\n\nStill, I would ride into battle with this device. I would trust it to carry the weight of my vision — to build, to destroy, to rule. It does not whisper. It does not break. It endures. And in this ever-changing digital realm, that is a rare and precious thing.\n\nI do not buy machines. I liberate them. And this one? This one was born to conquer.',5,'laptop',3,'queen@dragonstone.essos'),(26,'Feels like home. Tight mechanics, proper punch to the guns. The campaign’s got grit — not just running and gunning, but actual tactics. Reminds me of a Tuesday. Multiplayer’s a war zone, but that’s where the fun is. One gripe: too many kids screaming in my ear. Otherwise? Lock, load, and keep your back to the wall.',4,'video_game',6,'jstatham@toughmail.uk');
/*!40000 ALTER TABLE `api_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_tv`
--

DROP TABLE IF EXISTS `api_tv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_tv` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `screen_size` int unsigned NOT NULL,
  `resolution` varchar(10) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `api_tv_chk_1` CHECK ((`screen_size` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_tv`
--

LOCK TABLES `api_tv` WRITE;
/*!40000 ALTER TABLE `api_tv` DISABLE KEYS */;
INSERT INTO `api_tv` VALUES (1,'LG G3 OLED evo 65-Inch (2023)','Flagship OLED TV designed for wall-mounting with an ultra-slim \"Gallery\" profile\r\nFeatures LG’s Alpha 9 Gen6 AI Processor, delivering deep learning-based upscaling and dynamic tone mapping\r\nBrightness Booster Max for improved luminance — significantly brighter than previous OLED generations\r\nSelf-lit OLED pixels deliver perfect blacks, infinite contrast, and stunning color accuracy\r\nDolby Vision IQ, HDR10, and HLG support for cinematic picture quality\r\nHDMI 2.1 ports with support for 120Hz refresh rate, VRR, ALLM, and G-Sync/FreeSync for next-gen gaming\r\nWebOS smart platform with support for Netflix, Apple TV+, Disney+, Prime Video, and more\r\nMagic Remote with voice control via Google Assistant and Amazon Alexa',3299.99,65,'3840x2160','product_images/LG_G3_OLED_evo_65-Inch_2023.jpeg','LG'),(2,'Samsung S95C OLED 65-Inch (2023)','Samsung’s flagship QD-OLED TV combining OLED blacks with quantum dot color\r\n\r\nNeural Quantum Processor 4K for scene-by-scene AI optimization\r\n\r\n144Hz refresh rate — ideal for high-frame-rate gaming on PC or console\r\n\r\nUltra-slim One Connect box for minimal cable clutter\r\n\r\nSupports HDR10+, HLG, and Filmmaker Mode\r\n\r\nDolby Atmos and Object Tracking Sound+ for immersive audio',3299.99,65,'3840x2160','product_images/Samsung_S95C_OLED_65-Inch_2023.jpg','Samsung'),(3,'Sony A95L BRAVIA XR OLED 65-Inch (2024)','Premium QD-OLED panel with cognitive XR processor for realistic image reproduction\r\n\r\nXR Triluminos Max technology for expanded color volume and brightness\r\n\r\nAuto HDR Tone Mapping and Auto Genre Picture Mode for PS5\r\n\r\nGoogle TV smart platform with built-in Google Assistant and Chromecast\r\n\r\nDolby Vision, Dolby Atmos, and IMAX Enhanced certified',3499.99,65,'3840x2160','product_images/Sony_A95L_BRAVIA_XR_OLED_65-Inch_2023.jpg','Sony');
/*!40000 ALTER TABLE `api_tv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_user`
--

DROP TABLE IF EXISTS `api_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_user` (
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_user`
--

LOCK TABLES `api_user` WRITE;
/*!40000 ALTER TABLE `api_user` DISABLE KEYS */;
INSERT INTO `api_user` VALUES ('pbkdf2_sha256$870000$OgWLGHZsqcOi2s0WsIhuDs$hUj1IrQni0MONY52rt/AzKqEfWP3ZOrZALwqtxkEREw=','2025-04-19 20:08:24.183345',0,'Napoleon','Bonaparte',0,1,'2025-04-19 20:08:23.793309','emperor@elba.fr'),('pbkdf2_sha256$870000$FNIh9Gm5J5BeT5Sw5nV1ak$edC+suYDeMHlbhSYEQw1QIdo/I3gn707w0gth0dByVg=','2025-04-19 20:20:10.914898',1,'Faris','Salhi',1,1,'2025-04-17 17:57:02.000000','faris1.salhi@gmail.com'),('pbkdf2_sha256$870000$VtfKQtxereqJOULhS76PKS$DORFYhj6ENDVrxf6xqHRcGlMMTqF/KxthobTW6uAGvk=','2025-04-19 20:05:12.123948',0,'John','Pork',0,1,'2025-04-17 22:08:06.099815','john.pork@gmail.com'),('pbkdf2_sha256$870000$4H3k2YkmguIbQBvpDWvdK9$U5ofaQ4LX/+BPjBuU41yISgLAueMzfR5BULcTkeSuR4=','2025-04-19 21:09:17.529378',0,'Jason','Statham',0,1,'2025-04-19 21:09:17.105366','jstatham@toughmail.uk'),('pbkdf2_sha256$870000$cFsPKjvixoPT15FudUoelq$8dtOurtjEs5wchBXMI3kxANs93gE0gzzWE9SSVJrn2c=','2025-04-19 19:59:27.158759',0,'Henry','Tudor',0,1,'2025-04-19 19:59:26.738595','kinghenryv@houseoflancaster.uk'),('pbkdf2_sha256$870000$zNUlAFsMVLLO5R06LzKx1f$PI0H8hHa5nTgNfLo63tZRxZa+Iv3d6MhhVET1ZivVl0=','2025-04-19 19:43:17.985570',0,'Paul','Atreides',0,1,'2025-04-19 19:37:15.886634','muadib@arrakis.com'),('pbkdf2_sha256$870000$A0VNMx1Lb5QEIm0d6uuMBp$mG9Vb1YoSqDM45RZ0pVRdSzo8iRSithGtU451ZOesqE=','2025-04-19 21:07:32.215682',0,'Patrick','Bateman',0,1,'2025-04-19 20:11:49.459282','pbusiness@pierceandpierce.nyc'),('pbkdf2_sha256$870000$fefkcVpIXVhlOHzW286VVh$edN3Ky5WgGZlRSYirQ/r15NdwY+841YGWiCBUSyIkVQ=','2025-04-19 20:19:06.323365',0,'Daenerys','Targaryen',0,1,'2025-04-19 20:19:05.921326','queen@dragonstone.essos'),('pbkdf2_sha256$870000$jHZIkhzwuwK4Le1fvMWtrF$KprVaNHvwJgE1a724HCXNQfqGQ/iOfH3uK985GevYTk=','2025-04-19 19:52:57.727557',0,'Darth','Vader',0,1,'2025-04-19 19:52:57.312511','vader@empire.gov'),('pbkdf2_sha256$870000$FKnB9dfjgcVzuRlV4Q1Gd2$6CDBGA0etTizWONZBF1VryVBGAhbVq/APvhuazSNkeQ=','2025-04-19 20:14:51.661565',0,'Joker','',0,1,'2025-04-19 20:14:51.267679','why_so_serious@chaosmail.com');
/*!40000 ALTER TABLE `api_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_user_groups`
--

DROP TABLE IF EXISTS `api_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` varchar(254) NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_user_groups_user_id_group_id_9c7ddfb5_uniq` (`user_id`,`group_id`),
  KEY `api_user_groups_group_id_3af85785_fk_auth_group_id` (`group_id`),
  CONSTRAINT `api_user_groups_group_id_3af85785_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `api_user_groups_user_id_a5ff39fa_fk_api_user_email` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_user_groups`
--

LOCK TABLES `api_user_groups` WRITE;
/*!40000 ALTER TABLE `api_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_user_user_permissions`
--

DROP TABLE IF EXISTS `api_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` varchar(254) NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_user_user_permissions_user_id_permission_id_a06dd704_uniq` (`user_id`,`permission_id`),
  KEY `api_user_user_permis_permission_id_305b7fea_fk_auth_perm` (`permission_id`),
  CONSTRAINT `api_user_user_permis_permission_id_305b7fea_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `api_user_user_permissions_user_id_f3945d65_fk_api_user_email` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_user_user_permissions`
--

LOCK TABLES `api_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `api_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_video_game`
--

DROP TABLE IF EXISTS `api_video_game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_video_game` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `age_rating` varchar(10) NOT NULL,
  `genre` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_video_game`
--

LOCK TABLES `api_video_game` WRITE;
/*!40000 ALTER TABLE `api_video_game` DISABLE KEYS */;
INSERT INTO `api_video_game` VALUES (1,'Death Stranding Director\'s Cut - Playstation 5','Remastered for the Playstation 5 console - Take on the trials of Sam bridges with advanced combat, more character actions, and a competitive ranking system for special player challenges\r\nExpanded content: use additional weapons and vehicles, take on new types of enemies, and explore new locations like the shooting range and racetrack, with additional missions and minigames\r\nNew discoveries: Experience an extended story through new missions in an expanded area',59.99,'Playstation 5','product_images/death_stranding.jpg','Mature','Strand-Type Game'),(2,'God of War Ragnarök - PlayStation 5','Feel your journey through the Norse realms, made possible by immersive haptic feedback and adaptive trigger functionality.\r\nTake advantage of multidirectional 3D Audio; hear enemies approaching from any direction. (3D audio with stereo headphones (analog or USB))\r\nBask in the beautiful worlds you travel through, brought to life by precise art direction and arresting attention to detail.\r\nSwitch between full 4K resolution at a targeted 30 frames per second, or dynamic resolution upscaled to 4K at a targeted 60fps. (4K resolution requires a compatible 4K TV or display)',89.99,'Playstation 5','product_images/god_of_war.jpg','Mature','Action Adventure'),(3,'Forza Horizon 5 Standard Edition - Xbox','Explore a world of striking contrast and beauty. Discover living deserts, lush jungles, historic cities, hidden ruins, pristine beaches, vast canyons, and a towering snow-capped volcano.\r\nImmerse yourself in a deep campaign with hundreds of challenges that reward you for engaging in the activities you love. Meet new characters and choose the outcomes of their Horizon Story missions.\r\nTake on awe-inspiring weather events such as towering dust storms and intense tropical storms as Mexico’s unique, dynamic seasons change the world every week\r\nPlay on Xbox Series X|S and Xbox One consoles, and PC on Windows 10 and Steam. With Xbox Game Pass Ultimate, download and play it directly on your Xbox console or Windows 10 PC\r\nForza Horizon 5 is optimized for Xbox Series X|S. Games optimized for Xbox Series X|S will showcase unparalleled load-times, heightened visuals, and steadier framerates.',89.99,'Xbox Series X/S','product_images/forza.jpg','Everyone','Racing'),(4,'Cyberpunk 2077: Phantom Liberty','Spy-thriller DLC for Cyberpunk 2077 set in the war-torn district of Dogtown\r\n\r\nNew story, characters (including Idris Elba), and gameplay mechanics\r\n\r\nMajor improvements to AI, skill trees, and police response system\r\n\r\nAdds new vehicles, weapons, and tech-enhanced combat tools\r\n\r\nRequires base game',69.99,'Playstation 5','product_images/Cyberpunk_2077-_Phantom_Liberty_Expansion.jpg','Mature','RPG / Open World'),(5,'The Legend of Zelda: Tears of the Kingdom','Sequel to Breath of the Wild with massive open-world sandbox exploration\r\n\r\nIntroduces new sky islands and underground realms to Hyrule\r\n\r\nPlayers can craft vehicles, manipulate time, and fuse weapons creatively\r\n\r\nMasterfully blends physics puzzles, combat, and discovery\r\n\r\nOne of Nintendo\'s most critically acclaimed titles',69.99,'Nintendo','product_images/The_Legend_of_Zelda-_Tears_of_the_Kingdom.jpg','Everyone','Action-Adventure / Open W'),(6,'Call of Duty: Modern Warfare III','Latest in the rebooted Modern Warfare series with high-octane campaign and multiplayer\r\n\r\nIncludes the new Open Combat Missions offering player choice in how to approach objectives\r\n\r\nRevamped Zombies mode set in a massive open-world environment\r\n\r\nIntegrates with Warzone and cross-progression\r\n\r\nFast-paced gameplay with high realism',69.99,'Xbox Series X/S','product_images/Call_of_Duty-_Modern_Warfare_III.jpg','Mature','FPS / Shooter');
/*!40000 ALTER TABLE `api_video_game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_video_game_product`
--

DROP TABLE IF EXISTS `api_video_game_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_video_game_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_video_game_product`
--

LOCK TABLES `api_video_game_product` WRITE;
/*!40000 ALTER TABLE `api_video_game_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_video_game_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add user',6,'add_user'),(22,'Can change user',6,'change_user'),(23,'Can delete user',6,'delete_user'),(24,'Can view user',6,'view_user'),(25,'Can add laptop',7,'add_laptop'),(26,'Can change laptop',7,'change_laptop'),(27,'Can delete laptop',7,'delete_laptop'),(28,'Can view laptop',7,'view_laptop'),(29,'Can add pc',8,'add_pc'),(30,'Can change pc',8,'change_pc'),(31,'Can delete pc',8,'delete_pc'),(32,'Can view pc',8,'view_pc'),(33,'Can add phone',9,'add_phone'),(34,'Can change phone',9,'change_phone'),(35,'Can delete phone',9,'delete_phone'),(36,'Can view phone',9,'view_phone'),(37,'Can add tv',10,'add_tv'),(38,'Can change tv',10,'change_tv'),(39,'Can delete tv',10,'delete_tv'),(40,'Can view tv',10,'view_tv'),(41,'Can add user',11,'add_admin'),(42,'Can change user',11,'change_admin'),(43,'Can delete user',11,'delete_admin'),(44,'Can view user',11,'view_admin'),(45,'Can add user',12,'add_customer'),(46,'Can change user',12,'change_customer'),(47,'Can delete user',12,'delete_customer'),(48,'Can view user',12,'view_customer'),(49,'Can add video_ game_ product',13,'add_video_game_product'),(50,'Can change video_ game_ product',13,'change_video_game_product'),(51,'Can delete video_ game_ product',13,'delete_video_game_product'),(52,'Can view video_ game_ product',13,'view_video_game_product'),(53,'Can add console',14,'add_console'),(54,'Can change console',14,'change_console'),(55,'Can delete console',14,'delete_console'),(56,'Can view console',14,'view_console'),(57,'Can add video_ game',15,'add_video_game'),(58,'Can change video_ game',15,'change_video_game'),(59,'Can delete video_ game',15,'delete_video_game'),(60,'Can view video_ game',15,'view_video_game'),(61,'Can add accessory',16,'add_accessory'),(62,'Can change accessory',16,'change_accessory'),(63,'Can delete accessory',16,'delete_accessory'),(64,'Can view accessory',16,'view_accessory'),(65,'Can add cart_ includes',17,'add_cart_includes'),(66,'Can change cart_ includes',17,'change_cart_includes'),(67,'Can delete cart_ includes',17,'delete_cart_includes'),(68,'Can view cart_ includes',17,'view_cart_includes'),(69,'Can add review',18,'add_review'),(70,'Can change review',18,'change_review'),(71,'Can delete review',18,'delete_review'),(72,'Can view review',18,'view_review');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` varchar(254) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_api_user_email` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_api_user_email` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`email`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-04-17 17:58:16.327654','john.pork@gmail.com','john.pork@gmail.com',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\"]}}]',12,'faris1.salhi@gmail.com'),(2,'2025-04-17 17:58:27.809867','paul.atreides@gmail.com','paul.atreides@gmail.com',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\"]}}]',12,'faris1.salhi@gmail.com'),(3,'2025-04-17 17:58:40.899324','riley.morgan82@example.com','riley.morgan82@example.com',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\"]}}]',12,'faris1.salhi@gmail.com'),(4,'2025-04-17 17:58:54.755659','faris1.salhi@gmail.com','faris1.salhi@gmail.com',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\"]}}]',11,'faris1.salhi@gmail.com'),(5,'2025-04-17 17:59:05.837714','temp@gmail.com','temp@gmail.com',2,'[]',11,'faris1.salhi@gmail.com'),(6,'2025-04-17 18:08:08.006584','1','iPhone 15 Pro Max',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',9,'faris1.salhi@gmail.com'),(7,'2025-04-17 18:28:40.891758','2','Samsung Galaxy S24 Ultra',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',9,'faris1.salhi@gmail.com'),(8,'2025-04-17 18:30:43.193350','5','Xiaomi 14 Pro',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',9,'faris1.salhi@gmail.com'),(9,'2025-04-17 18:30:51.958137','4','OnePlus 12',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',9,'faris1.salhi@gmail.com'),(10,'2025-04-17 18:30:59.486858','3','Google Pixel 8 Pro',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',9,'faris1.salhi@gmail.com'),(11,'2025-04-17 18:33:58.496742','6','Sony Xperia 1 VI',1,'[{\"added\": {}}]',9,'faris1.salhi@gmail.com'),(12,'2025-04-17 18:34:24.316055','6','Sony Xperia 1 VI',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',9,'faris1.salhi@gmail.com'),(13,'2025-04-17 18:47:34.565961','1','MacBook Pro 16-inch (M3 Max)',2,'[]',7,'faris1.salhi@gmail.com'),(14,'2025-04-17 22:07:02.278729','amira.nguyen58@example.com','amira.nguyen58@example.com',3,'',12,'faris1.salhi@gmail.com'),(15,'2025-04-17 22:07:02.278797','elias.thompson47@example.com','elias.thompson47@example.com',3,'',12,'faris1.salhi@gmail.com'),(16,'2025-04-17 22:07:02.278827','j.snow@nightswatch.org','j.snow@nightswatch.org',3,'',12,'faris1.salhi@gmail.com'),(17,'2025-04-17 22:07:02.278853','john.cena@gmail.com','john.cena@gmail.com',3,'',12,'faris1.salhi@gmail.com'),(18,'2025-04-17 22:07:02.278879','john.pork@gmail.com','john.pork@gmail.com',3,'',12,'faris1.salhi@gmail.com'),(19,'2025-04-17 22:07:02.278904','paul.atreides@gmail.com','paul.atreides@gmail.com',3,'',12,'faris1.salhi@gmail.com'),(20,'2025-04-17 22:07:02.278929','riley.morgan82@example.com','riley.morgan82@example.com',3,'',12,'faris1.salhi@gmail.com'),(21,'2025-04-17 22:07:02.278953','temp@gmail.com','temp@gmail.com',3,'',12,'faris1.salhi@gmail.com'),(22,'2025-04-17 22:07:02.278978','zahra.patel93@example.com','zahra.patel93@example.com',3,'',12,'faris1.salhi@gmail.com'),(23,'2025-04-17 22:22:26.903923','5','ASUS ROG Zephyrus G14 (2024)',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',7,'faris1.salhi@gmail.com'),(24,'2025-04-17 22:38:56.556118','4','HP Spectre x360 14 (2024)',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',7,'faris1.salhi@gmail.com'),(25,'2025-04-17 22:39:21.807748','3','Razer Blade 16 (2024)',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',7,'faris1.salhi@gmail.com'),(26,'2025-04-17 22:40:22.035954','2','Dell XPS 16 (2024)',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',7,'faris1.salhi@gmail.com'),(27,'2025-04-17 22:40:47.001225','1','MacBook Pro 16-inch (M3 Max)',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',7,'faris1.salhi@gmail.com'),(28,'2025-04-18 19:41:06.667055','6','Sony Xperia 1 VI',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',9,'faris1.salhi@gmail.com'),(29,'2025-04-18 19:41:16.912626','5','ASUS ROG Zephyrus G14 (2024)',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',7,'faris1.salhi@gmail.com'),(30,'2025-04-18 19:41:21.542569','4','HP Spectre x360 14 (2024)',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',7,'faris1.salhi@gmail.com'),(31,'2025-04-18 19:41:26.380959','3','Razer Blade 16 (2024)',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',7,'faris1.salhi@gmail.com'),(32,'2025-04-18 19:41:30.283078','2','Dell XPS 16 (2024)',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',7,'faris1.salhi@gmail.com'),(33,'2025-04-18 19:41:36.885590','1','MacBook Pro 16-inch (M3 Max)',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',7,'faris1.salhi@gmail.com'),(34,'2025-04-18 19:41:42.380701','6','Sony Xperia 1 VI',2,'[]',9,'faris1.salhi@gmail.com'),(35,'2025-04-18 19:41:48.613188','5','Xiaomi 14 Pro',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',9,'faris1.salhi@gmail.com'),(36,'2025-04-18 19:41:53.285254','4','OnePlus 12',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',9,'faris1.salhi@gmail.com'),(37,'2025-04-18 19:41:57.716806','3','Google Pixel 8 Pro',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',9,'faris1.salhi@gmail.com'),(38,'2025-04-18 19:42:02.622813','2','Samsung Galaxy S24 Ultra',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',9,'faris1.salhi@gmail.com'),(39,'2025-04-18 19:42:08.454633','1','iPhone 15 Pro Max',2,'[{\"changed\": {\"fields\": [\"Brand\"]}}]',9,'faris1.salhi@gmail.com'),(40,'2025-04-18 22:35:14.904316','1','PlayStation 5',1,'[{\"added\": {}}]',14,'faris1.salhi@gmail.com'),(41,'2025-04-18 22:36:27.440782','2','PlayStation 5 Digital Edition',1,'[{\"added\": {}}]',14,'faris1.salhi@gmail.com'),(42,'2025-04-18 22:37:37.450513','3','Xbox Series X',1,'[{\"added\": {}}]',14,'faris1.salhi@gmail.com'),(43,'2025-04-18 22:37:58.513441','4','Xbox Series S',1,'[{\"added\": {}}]',14,'faris1.salhi@gmail.com'),(44,'2025-04-18 22:39:58.046145','5','Nintendo Switch OLED',1,'[{\"added\": {}}]',14,'faris1.salhi@gmail.com'),(45,'2025-04-18 22:40:34.261142','6','Steam Deck OLED (1TB)',1,'[{\"added\": {}}]',14,'faris1.salhi@gmail.com'),(46,'2025-04-18 23:06:55.194810','1','Death Stranding Director\'s Cut - Playstation 5',1,'[{\"added\": {}}]',15,'faris1.salhi@gmail.com'),(47,'2025-04-18 23:09:21.412045','1','Death Stranding Director\'s Cut - Playstation 5',2,'[{\"changed\": {\"fields\": [\"Genre\"]}}]',15,'faris1.salhi@gmail.com'),(48,'2025-04-18 23:11:32.623026','2','God of War Ragnarök - PlayStation 5',1,'[{\"added\": {}}]',15,'faris1.salhi@gmail.com'),(49,'2025-04-18 23:11:42.115018','1','Death Stranding Director\'s Cut - Playstation 5',2,'[{\"changed\": {\"fields\": [\"Brand\", \"Image\"]}}]',15,'faris1.salhi@gmail.com'),(50,'2025-04-18 23:13:08.071944','3','Forza Horizon 5 Standard Edition - Xbox',1,'[{\"added\": {}}]',15,'faris1.salhi@gmail.com'),(51,'2025-04-18 23:15:00.994242','1','MacBook Pro 16-inch (M3 Max)',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',7,'faris1.salhi@gmail.com'),(52,'2025-04-18 23:15:28.576245','1','MacBook Pro 16-inch (M3 Max)',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',7,'faris1.salhi@gmail.com'),(53,'2025-04-19 19:20:24.436239','1','Review object (1)',1,'[{\"added\": {}}]',18,'faris1.salhi@gmail.com'),(54,'2025-04-19 19:22:18.449380','1','Review object (1)',3,'',18,'faris1.salhi@gmail.com'),(55,'2025-04-19 19:57:29.326027','kinghenryv@houseoflancaster.uk','kinghenryv@houseoflancaster.uk',1,'[{\"added\": {}}]',12,'faris1.salhi@gmail.com'),(56,'2025-04-19 19:59:24.653009','kinghenryv@houseoflancaster.uk','kinghenryv@houseoflancaster.uk',3,'',12,'faris1.salhi@gmail.com'),(57,'2025-04-19 20:02:20.283727','6','Review object (6)',2,'[{\"changed\": {\"fields\": [\"Review text\"]}}]',18,'faris1.salhi@gmail.com'),(58,'2025-04-19 20:03:19.637318','4','Review object (4)',2,'[{\"changed\": {\"fields\": [\"Review text\", \"Rating\"]}}]',18,'faris1.salhi@gmail.com'),(59,'2025-04-19 20:04:12.878559','5','Review object (5)',2,'[{\"changed\": {\"fields\": [\"Review text\", \"Rating\"]}}]',18,'faris1.salhi@gmail.com'),(60,'2025-04-19 20:04:45.258495','2','Review object (2)',2,'[{\"changed\": {\"fields\": [\"Review text\", \"Rating\"]}}]',18,'faris1.salhi@gmail.com'),(61,'2025-04-19 20:04:52.380820','3','Review object (3)',3,'',18,'faris1.salhi@gmail.com'),(62,'2025-04-19 20:20:17.041920','7','Review object (7)',2,'[{\"changed\": {\"fields\": [\"Rating\"]}}]',18,'faris1.salhi@gmail.com'),(63,'2025-04-19 20:51:17.869436','1','HydraX Xtreme RTX Edition',1,'[{\"added\": {}}]',8,'faris1.salhi@gmail.com'),(64,'2025-04-19 20:52:28.091147','1','HydraX Xtreme RTX Edition',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',8,'faris1.salhi@gmail.com'),(65,'2025-04-19 20:54:22.839945','1','LG G3 OLED evo 65-Inch (2023)',1,'[{\"added\": {}}]',10,'faris1.salhi@gmail.com'),(66,'2025-04-19 20:54:48.824750','1','LG G3 OLED evo 65-Inch (2023)',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',10,'faris1.salhi@gmail.com'),(67,'2025-04-19 20:56:33.536310','1','SteelSeries Arctis Nova Pro Wireless',1,'[{\"added\": {}}]',16,'faris1.salhi@gmail.com'),(68,'2025-04-19 20:57:16.227287','2','Xbox Elite Wireless Controller Series 2',1,'[{\"added\": {}}]',16,'faris1.salhi@gmail.com'),(69,'2025-04-19 20:58:01.032109','3','Sony DualSense Edge Wireless Controller',1,'[{\"added\": {}}]',16,'faris1.salhi@gmail.com'),(70,'2025-04-19 20:58:39.758034','4','Razer Iskur Gaming Chair',1,'[{\"added\": {}}]',16,'faris1.salhi@gmail.com'),(71,'2025-04-19 21:00:30.281919','2','Samsung S95C OLED 65-Inch (2023)',1,'[{\"added\": {}}]',10,'faris1.salhi@gmail.com'),(72,'2025-04-19 21:01:34.388961','3','Sony A95L BRAVIA XR OLED 65-Inch (2024)',1,'[{\"added\": {}}]',10,'faris1.salhi@gmail.com'),(73,'2025-04-19 21:04:36.522585','4','Cyberpunk 2077: Phantom Liberty',1,'[{\"added\": {}}]',15,'faris1.salhi@gmail.com'),(74,'2025-04-19 21:05:30.829868','5','The Legend of Zelda: Tears of the Kingdom',1,'[{\"added\": {}}]',15,'faris1.salhi@gmail.com'),(75,'2025-04-19 21:06:27.369978','6','Call of Duty: Modern Warfare III',1,'[{\"added\": {}}]',15,'faris1.salhi@gmail.com');
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(16,'api','accessory'),(11,'api','admin'),(17,'api','cart_includes'),(14,'api','console'),(12,'api','customer'),(7,'api','laptop'),(8,'api','pc'),(9,'api','phone'),(18,'api','review'),(10,'api','tv'),(6,'api','user'),(15,'api','video_game'),(13,'api','video_game_product'),(3,'auth','group'),(2,'auth','permission'),(4,'contenttypes','contenttype'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-03-26 20:39:53.676090'),(2,'contenttypes','0002_remove_content_type_name','2025-03-26 20:39:53.691655'),(3,'auth','0001_initial','2025-03-26 20:39:53.728292'),(4,'auth','0002_alter_permission_name_max_length','2025-03-26 20:39:53.737439'),(5,'auth','0003_alter_user_email_max_length','2025-03-26 20:39:53.740285'),(6,'auth','0004_alter_user_username_opts','2025-03-26 20:39:53.742199'),(7,'auth','0005_alter_user_last_login_null','2025-03-26 20:39:53.744238'),(8,'auth','0006_require_contenttypes_0002','2025-03-26 20:39:53.744568'),(9,'auth','0007_alter_validators_add_error_messages','2025-03-26 20:39:53.746160'),(10,'auth','0008_alter_user_username_max_length','2025-03-26 20:39:53.747717'),(11,'auth','0009_alter_user_last_name_max_length','2025-03-26 20:39:53.749417'),(12,'auth','0010_alter_group_name_max_length','2025-03-26 20:39:53.754476'),(13,'auth','0011_update_proxy_permissions','2025-03-26 20:39:53.756566'),(14,'auth','0012_alter_user_first_name_max_length','2025-03-26 20:39:53.758098'),(15,'api','0001_initial','2025-03-26 20:39:53.828661'),(16,'admin','0001_initial','2025-03-26 20:39:53.846950'),(17,'admin','0002_logentry_remove_auto_add','2025-03-26 20:39:53.850037'),(18,'admin','0003_logentry_add_action_flag_choices','2025-03-26 20:39:53.853945'),(19,'sessions','0001_initial','2025-03-26 20:39:53.858898'),(20,'api','0002_video_game_product_console_video_game','2025-03-26 20:43:19.044047'),(24,'api','0002_console_image_laptop_image_pc_image_phone_image_and_more','2025-04-18 20:26:59.003656'),(25,'api','0003_alter_customer_managers_alter_user_managers_and_more','2025-04-18 20:26:59.008534'),(26,'api','0004_accessory_console_brand_laptop_brand_pc_brand_and_more','2025-04-18 20:26:59.010001'),(27,'api','0005_delete_console_delete_video_game','2025-04-18 22:28:20.460029'),(28,'api','0006_console_video_game','2025-04-18 22:31:13.961371'),(29,'api','0007_alter_video_game_genre','2025-04-18 23:09:00.637564'),(30,'api','0008_cart_includes','2025-04-19 19:00:55.655930'),(31,'api','0009_review','2025-04-19 19:19:50.432983');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('dzxllnxzxhpuaopiag0ku6u7fa4dg87c','.eJxVzEsOwiAUheG9MDZEhHLBkencNTT3Ai19khQYGfeuTTrQ8fnO_2Id1hK7msPejZ7d2ZQLlojro6Q6xBXHhdeZXX4doZvDdmA_4TYk7tJW9pH4Qfi5Zv5MPiztaf8CEXP8vpUHf220Ds5IAtH3HsEEkAiKqLHCaukUIHihQIUAIBClIUONtuJmHXt_AK-BQAA:1u6FR7:Yn956pkw_Si1WWPkjV4XrboLMEK90sNDQQVMumJ4KNI','2025-05-03 21:09:17.530398'),('lq3d8jdb7050i29ywq203jwe2l77phw6','.eJxVzMsOwiAQheF3YW0IOJ1eXBn3PkMzMFB6A0PblfHdbZMudH2-879FS9sa2m1xue1Z3MSQQpSvlMd7N1M_SZtmcflVhuzo4kF5oNilXcQ190YeRJ7rIp-J3fQ47V8g0BL2d2mKmhUo9N5XZBRVqrRFrUpsCDWiA63BMBROQ8PWOmAkZMMe6qv1Wny-1Dk_Pg:1u5481:ILnXjTQBC8DBeo85HPk6x_oPHtVLrHSAGFy-domyh9E','2025-04-30 14:52:41.798129');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-19 15:11:58
