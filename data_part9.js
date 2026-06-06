// Game IP Derivative Works Database - Extended Set Part 9
(function(){
  const EXT = [
  // ============================================================
  // BIOSHOCK
  // ============================================================
  {ip:"BioShock", title:"BioShock 2 (Game)", type:"game-spinoff", year:2010, region:"US", publisher:"2K Games", desc:"续作。", tags:["FPS"]},
  {ip:"BioShock", title:"BioShock Infinite (Game)", type:"game-spinoff", year:2013, region:"US", publisher:"2K Games", desc:"续作。", tags:["FPS"]},
  {ip:"BioShock", title:"BioShock Infinite: Burial at Sea (DLC)", type:"game-spinoff", year:2013, region:"US", publisher:"2K Games", desc:"DLC。", tags:["DLC"]},
  {ip:"BioShock", title:"BioShock: The Collection (Remastered)", type:"game-spinoff", year:2016, region:"US", publisher:"2K Games", desc:"合集重制。", tags:["重制"]},
  {ip:"BioShock", title:"BioShock (Novel - Rapture)", type:"novel", year:2011, region:"US", publisher:"Tor Books", desc:"小说。", tags:["小说"]},
  {ip:"BioShock", title:"BioShock: Breaking the Mold (Novel)", type:"novel", year:2016, region:"US", publisher:"Tor Books", desc:"小说。", tags:["小说"]},
  {ip:"BioShock", title:"BioShock: From Rapture to Columbia (Artbook)", type:"artbook", year:2016, region:"US", publisher:"2K Games", desc:"画集。", tags:["画集"]},
  {ip:"BioShock", title:"BioShock (Manga)", type:"manga", year:2011, region:"US", publisher:"2K Games", desc:"漫画。", tags:["美式漫画"]},
  {ip:"BioShock", title:"BioShock (Film - In Development)", type:"film-live", year:2025, region:"US", publisher:"Netflix", desc:"真人电影开发中。", tags:["真人电影"]},
  {ip:"BioShock", title:"BioShock OST (Garry Schyman)", type:"ost", year:2007, region:"US", publisher:"2K Games", desc:"原声。", tags:["OST"]},
  {ip:"BioShock", title:"BioShock Infinite OST", type:"ost", year:2013, region:"US", publisher:"2K Games", desc:"原声。", tags:["OST"]},
  {ip:"BioShock", title:"BioShock (Funko Pop - Big Daddy)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"BioShock", title:"BioShock (Plush - Big Daddy)", type:"merch-figure", year:2018, region:"US", publisher:"2K Games", desc:"毛绒。", tags:["毛绒"]},
  {ip:"BioShock", title:"BioShock (Big Daddy Replica - 1:1)", type:"merch-toy", year:2018, region:"US", publisher:"Sideshow", desc:"复刻。", tags:["道具"]},
  {ip:"BioShock", title:"BioShock (Plush - Little Sister)", type:"merch-figure", year:2018, region:"US", publisher:"2K Games", desc:"小妹妹毛绒。", tags:["毛绒"]},

  // ============================================================
  // BORDERLANDS
  // ============================================================
  {ip:"Borderlands", title:"Borderlands 2 (Game)", type:"game-spinoff", year:2012, region:"US", publisher:"2K Games", desc:"续作。", tags:["FPS"]},
  {ip:"Borderlands", title:"Borderlands: The Pre-Sequel", type:"game-spinoff", year:2014, region:"US", publisher:"2K Games", desc:"续作。", tags:["FPS"]},
  {ip:"Borderlands", title:"Borderlands 3 (Game)", type:"game-spinoff", year:2019, region:"US", publisher:"2K Games", desc:"续作。", tags:["FPS"]},
  {ip:"Borderlands", title:"Tiny Tina's Wonderlands (Game)", type:"game-spinoff", year:2022, region:"US", publisher:"2K Games", desc:"衍生。", tags:["FPS"]},
  {ip:"Borderlands", title:"Borderlands (Film 2024)", type:"film-live", year:2024, region:"US", publisher:"Lionsgate", desc:"真人电影。", tags:["真人电影"]},
  {ip:"Borderlands", title:"Borderlands 4 (Upcoming)", type:"game-spinoff", year:2025, region:"US", publisher:"2K Games", desc:"新作。", tags:["FPS"]},
  {ip:"Borderlands", title:"Borderlands (Manga - Lilith's Story)", type:"manga", year:2014, region:"US", publisher:"IDW", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Borderlands", title:"Borderlands (Manga - Moxxi's Story)", type:"manga", year:2014, region:"US", publisher:"IDW", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Borderlands", title:"Borderlands (Manga - Tannis and the Vault)", type:"manga", year:2014, region:"US", publisher:"IDW", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Borderlands", title:"Borderlands (Manga - Origins)", type:"manga", year:2014, region:"US", publisher:"IDW", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Borderlands", title:"Tales from the Borderlands (Telltale Game)", type:"game-spinoff", year:2014, region:"US", publisher:"Telltale", desc:"外传。", tags:["冒险"]},
  {ip:"Borderlands", title:"Borderlands (Novel - The Fall of Elpis)", type:"novel", year:2018, region:"US", publisher:"2K Games", desc:"小说。", tags:["小说"]},
  {ip:"Borderlands", title:"Borderlands (Novel - The Beast of Bangor)", type:"novel", year:2024, region:"US", publisher:"2K Games", desc:"小说。", tags:["小说"]},
  {ip:"Borderlands", title:"Borderlands 3 OST", type:"ost", year:2019, region:"US", publisher:"2K Games", desc:"原声。", tags:["OST"]},
  {ip:"Borderlands", title:"Borderlands 2 OST (Jesper Kyd / Cris Velasco)", type:"ost", year:2012, region:"US", publisher:"2K Games", desc:"原声。", tags:["OST"]},
  {ip:"Borderlands", title:"Borderlands (Funko Pop - Claptrap)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Borderlands", title:"Borderlands (Funko Pop - Lilith)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Borderlands", title:"Borderlands (Action Figure - McFarlane)", type:"merch-figure", year:2019, region:"US", publisher:"McFarlane Toys", desc:"可动人偶。", tags:["可动"]},
  {ip:"Borderlands", title:"Borderlands (Plush - Claptrap)", type:"merch-figure", year:2018, region:"US", publisher:"2K Games", desc:"毛绒。", tags:["毛绒"]},
  {ip:"Borderlands", title:"Borderlands (Pachinko)", type:"pachinko", year:2015, region:"JP", publisher:"Sammy", desc:"柏青哥。", tags:["柏青哥"]},

  // ============================================================
  // MASS EFFECT
  // ============================================================
  {ip:"Mass Effect", title:"Mass Effect 2 (Game)", type:"game-spinoff", year:2010, region:"US", publisher:"BioWare", desc:"续作。", tags:["RPG"]},
  {ip:"Mass Effect", title:"Mass Effect 3 (Game)", type:"game-spinoff", year:2012, region:"US", publisher:"BioWare", desc:"续作。", tags:["RPG"]},
  {ip:"Mass Effect", title:"Mass Effect: Andromeda (Game)", type:"game-spinoff", year:2017, region:"US", publisher:"BioWare", desc:"续作。", tags:["RPG"]},
  {ip:"Mass Effect", title:"Mass Effect Legendary Edition", type:"game-spinoff", year:2021, region:"US", publisher:"BioWare", desc:"合集重制。", tags:["重制"]},
  {ip:"Mass Effect", title:"Mass Effect 4 (Upcoming)", type:"game-spinoff", year:2026, region:"US", publisher:"BioWare", desc:"新作。", tags:["RPG"]},
  {ip:"Mass Effect", title:"Mass Effect (Novel - Revelation)", type:"novel", year:2007, region:"US", publisher:"Del Rey", desc:"小说。", tags:["小说"]},
  {ip:"Mass Effect", title:"Mass Effect (Novel - Ascension)", type:"novel", year:2008, region:"US", publisher:"Del Rey", desc:"小说。", tags:["小说"]},
  {ip:"Mass Effect", title:"Mass Effect (Novel - Retribution)", type:"novel", year:2009, region:"US", publisher:"Del Rey", desc:"小说。", tags:["小说"]},
  {ip:"Mass Effect", title:"Mass Effect (Novel - Deception)", type:"novel", year:2013, region:"US", publisher:"Del Rey", desc:"小说。", tags:["小说"]},
  {ip:"Mass Effect", title:"Mass Effect (Novel - Initiation)", type:"novel", year:2015, region:"US", publisher:"Del Rey", desc:"小说。", tags:["小说"]},
  {ip:"Mass Effect", title:"Mass Effect (Novel - Annihilation)", type:"novel", year:2016, region:"US", publisher:"Del Rey", desc:"小说。", tags:["小说"]},
  {ip:"Mass Effect", title:"Mass Effect (Manga - Redemption)", type:"manga", year:2010, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Mass Effect", title:"Mass Effect (Manga - Evolution)", type:"manga", year:2011, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Mass Effect", title:"Mass Effect (Manga - Invasion)", type:"manga", year:2011, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Mass Effect", title:"Mass Effect (Manga - Homeworlds)", type:"manga", year:2012, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Mass Effect", title:"Mass Effect (Manga - Incursion)", type:"manga", year:2019, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Mass Effect", title:"Mass Effect (Manga - Nexus)", type:"manga", year:2020, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Mass Effect", title:"Mass Effect (Comic - Blasto: Eternity Is Forever)", type:"manga", year:2019, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Mass Effect", title:"Mass Effect 2 OST", type:"ost", year:2010, region:"US", publisher:"BioWare", desc:"原声。", tags:["OST"]},
  {ip:"Mass Effect", title:"Mass Effect 3 OST (Clint Mansell)", type:"ost", year:2012, region:"US", publisher:"BioWare", desc:"原声。", tags:["OST"]},
  {ip:"Mass Effect", title:"Mass Effect: Andromeda OST", type:"ost", year:2017, region:"US", publisher:"BioWare", desc:"原声。", tags:["OST"]},
  {ip:"Mass Effect", title:"Mass Effect (Funko Pop - Garrus)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Mass Effect", title:"Mass Effect (Funko Pop - Shepard)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Mass Effect", title:"Mass Effect (Funko Pop - Wrex)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Mass Effect", title:"Mass Effect (Cerberus Statue)", type:"merch-figure", year:2018, region:"US", publisher:"Gaming Heads", desc:"雕像。", tags:["雕像"]},
  {ip:"Mass Effect (Funko Pop - Liara)", type:"Mass Effect", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},

  // ============================================================
  // DRAGON AGE
  // ============================================================
  {ip:"Dragon Age", title:"Dragon Age: Origins (Game)", type:"game-spinoff", year:2009, region:"US", publisher:"BioWare", desc:"初代。", tags:["RPG"]},
  {ip:"Dragon Age", title:"Dragon Age II (Game)", type:"game-spinoff", year:2011, region:"US", publisher:"BioWare", desc:"续作。", tags:["RPG"]},
  {ip:"Dragon Age", title:"Dragon Age: Inquisition (Game)", type:"game-spinoff", year:2014, region:"US", publisher:"BioWare", desc:"续作。", tags:["RPG"]},
  {ip:"Dragon Age", title:"Dragon Age: The Veilguard (Game)", type:"game-spinoff", year:2024, region:"US", publisher:"BioWare", desc:"续作。", tags:["RPG"]},
  {ip:"Dragon Age", title:"Dragon Age (Novel - The Stolen Throne)", type:"novel", year:2009, region:"US", publisher:"Orbit", desc:"小说。", tags:["小说"]},
  {ip:"Dragon Age", title:"Dragon Age (Novel - The Calling)", type:"novel", year:2009, region:"US", publisher:"Orbit", desc:"小说。", tags:["小说"]},
  {ip:"Dragon Age", title:"Dragon Age (Novel - Asunder)", type:"novel", year:2011, region:"US", publisher:"Orbit", desc:"小说。", tags:["小说"]},
  {ip:"Dragon Age", title:"Dragon Age (Novel - The Masked Empire)", type:"novel", year:2013, region:"US", publisher:"Orbit", desc:"小说。", tags:["小说"]},
  {ip:"Dragon Age", title:"Dragon Age (Novel - Last Flight)", type:"novel", year:2014, region:"US", publisher:"Orbit", desc:"小说。", tags:["小说"]},
  {ip:"Dragon Age", title:"Dragon Age (Novel - The World of Thedas)", type:"novel", year:2013, region:"US", publisher:"Dark Horse", desc:"百科。", tags:["百科"]},
  {ip:"Dragon Age", title:"Dragon Age (Manga - The Silent Grove)", type:"manga", year:2012, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Dragon Age", title:"Dragon Age (Manga - Those Who Speak)", type:"manga", year:2012, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Dragon Age", title:"Dragon Age (Manga - Until We Sleep)", type:"manga", year:2012, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Dragon Age", title:"Dragon Age: Dawn of the Seeker (Anime Film)", type:"film-anime", year:2012, region:"JP", publisher:"BioWare / Funimation", desc:"CG 剧场版。", tags:["CG 剧场版"]},
  {ip:"Dragon Age", title:"Dragon Age: Inquisition OST (Trevor Morris)", type:"ost", year:2014, region:"US", publisher:"BioWare", desc:"原声。", tags:["OST"]},
  {ip:"Dragon Age", title:"Dragon Age: Origins OST (Inon Zur)", type:"ost", year:2009, region:"US", publisher:"BioWare", desc:"原声。", tags:["OST"]},
  {ip:"Dragon Age", title:"Dragon Age: The Veilguard OST", type:"ost", year:2024, region:"US", publisher:"BioWare", desc:"原声。", tags:["OST"]},
  {ip:"Dragon Age", title:"Dragon Age (Funko Pop - Varric)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Dragon Age", title:"Dragon Age (Funko Pop - Cassandra)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Dragon Age", title:"Dragon Age (Funko Pop - Morrigan)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Dragon Age", title:"Dragon Age (Action Figure - Iron Bull)", type:"merch-figure", year:2018, region:"US", publisher:"Gaming Heads", desc:"雕像。", tags:["雕像"]},
  {ip:"Dragon Age", title:"Dragon Age: Tevinter Nights (Anthology Novel)", type:"novel", year:2020, region:"US", publisher:"Orbit", desc:"小说选集。", tags:["小说"]},

  // ============================================================
  // SPLINTER CELL (Ubisoft)
  // ============================================================
  {ip:"Splinter Cell", title:"Splinter Cell (Manga)", type:"manga", year:2004, region:"US", publisher:"DC Comics", desc:"美式漫画。", tags:["美式漫画"]},
  {ip:"Splinter Cell", title:"Splinter Cell (Novel - Operation Barracuda)", type:"novel", year:2005, region:"US", publisher:"Penguin", desc:"小说。", tags:["小说"]},
  {ip:"Splinter Cell", title:"Splinter Cell: Blacklist (Game)", type:"game-spinoff", year:2013, region:"US", publisher:"Ubisoft", desc:"续作。", tags:["潜行"]},
  {ip:"Splinter Cell", title:"Splinter Cell: Chaos Theory", type:"game-spinoff", year:2005, region:"US", publisher:"Ubisoft", desc:"续作。", tags:["潜行"]},
  {ip:"Splinter Cell", title:"Splinter Cell: Conviction (Game)", type:"game-spinoff", year:2010, region:"US", publisher:"Ubisoft", desc:"续作。", tags:["潜行"]},
  {ip:"Splinter Cell", title:"Splinter Cell (Tom Clancy's) (Film - In Development)", type:"film-live", year:2025, region:"US", publisher:"Paramount", desc:"真人电影开发中。", tags:["真人电影"]},
  {ip:"Splinter Cell", title:"Splinter Cell (Animated Series - In Development)", type:"anime", year:2024, region:"US", publisher:"Netflix", desc:"动画开发中。", tags:["动画"]},
  {ip:"Splinter Cell", title:"Splinter Cell (Funko Pop - Sam Fisher)", type:"merch-figure", year:2019, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Splinter Cell", title:"Splinter Cell OST (Michael McCann)", type:"ost", year:2013, region:"US", publisher:"Ubisoft", desc:"原声。", tags:["OST"]},

  // ============================================================
  // FAR CRY
  // ============================================================
  {ip:"Far Cry", title:"Far Cry 2 (Game)", type:"game-spinoff", year:2008, region:"CA", publisher:"Ubisoft", desc:"续作。", tags:["FPS"]},
  {ip:"Far Cry", title:"Far Cry 3 (Game)", type:"game-spinoff", year:2012, region:"CA", publisher:"Ubisoft", desc:"续作。", tags:["FPS"]},
  {ip:"Far Cry", title:"Far Cry 3: Blood Dragon (Game)", type:"game-spinoff", year:2013, region:"CA", publisher:"Ubisoft", desc:"外传。", tags:["FPS"]},
  {ip:"Far Cry", title:"Far Cry 4 (Game)", type:"game-spinoff", year:2014, region:"CA", publisher:"Ubisoft", desc:"续作。", tags:["FPS"]},
  {ip:"Far Cry", title:"Far Cry Primal (Game)", type:"game-spinoff", year:2016, region:"CA", publisher:"Ubisoft", desc:"外传。", tags:["FPS"]},
  {ip:"Far Cry", title:"Far Cry 5 (Game)", type:"game-spinoff", year:2018, region:"CA", publisher:"Ubisoft", desc:"续作。", tags:["FPS"]},
  {ip:"Far Cry", title:"Far Cry New Dawn (Game)", type:"game-spinoff", year:2019, region:"CA", publisher:"Ubisoft", desc:"续作。", tags:["FPS"]},
  {ip:"Far Cry", title:"Far Cry 6 (Game)", type:"game-spinoff", year:2021, region:"CA", publisher:"Ubisoft", desc:"续作。", tags:["FPS"]},
  {ip:"Far Cry", title:"Far Cry 3 (Film - In Development)", type:"film-live", year:2025, region:"US", publisher:"New Regency", desc:"真人电影。", tags:["真人电影"]},
  {ip:"Far Cry", title:"Far Cry (Manga)", type:"manga", year:2013, region:"US", publisher:"Dark Horse", desc:"美式漫画。", tags:["美式漫画"]},
  {ip:"Far Cry", title:"Far Cry 3 OST", type:"ost", year:2012, region:"CA", publisher:"Ubisoft", desc:"原声。", tags:["OST"]},
  {ip:"Far Cry", title:"Far Cry 6 OST", type:"ost", year:2021, region:"CA", publisher:"Ubisoft", desc:"原声。", tags:["OST"]},
  {ip:"Far Cry", title:"Far Cry 3: Blood Dragon OST (Power Glove)", type:"ost", year:2013, region:"CA", publisher:"Ubisoft", desc:"原声。", tags:["OST"]},

  // ============================================================
  // WATCH DOGS
  // ============================================================
  {ip:"Watch Dogs", title:"Watch Dogs (Game)", type:"game-spinoff", year:2014, region:"CA", publisher:"Ubisoft", desc:"原版。", tags:["ACT"]},
  {ip:"Watch Dogs", title:"Watch Dogs 2 (Game)", type:"game-spinoff", year:2016, region:"CA", publisher:"Ubisoft", desc:"续作。", tags:["ACT"]},
  {ip:"Watch Dogs", title:"Watch Dogs: Legion (Game)", type:"game-spinoff", year:2020, region:"CA", publisher:"Ubisoft", desc:"续作。", tags:["ACT"]},
  {ip:"Watch Dogs", title:"Watch Dogs (OST)", type:"ost", year:2014, region:"CA", publisher:"Ubisoft", desc:"原声。", tags:["OST"]},
  {ip:"Watch Dogs", title:"Watch Dogs 2 OST", type:"ost", year:2016, region:"CA", publisher:"Ubisoft", desc:"原声。", tags:["OST"]},
  {ip:"Watch Dogs", title:"Watch Dogs: Legion OST", type:"ost", year:2020, region:"CA", publisher:"Ubisoft", desc:"原声。", tags:["OST"]},

  // ============================================================
  // RAYMAN
  // ============================================================
  {ip:"Rayman", title:"Rayman (Manga)", type:"manga", year:1995, region:"FR", publisher:"Ubi Soft", desc:"漫画。", tags:["少年漫画"]},
  {ip:"Rayman", title:"Rayman (TV Series 1999 - The Animated Series)", type:"tv", year:1999, region:"FR", publisher:"Ubi Soft", desc:"动画剧集。", tags:["动画"]},
  {ip:"Rayman", title:"Rayman Origins (Game)", type:"game-spinoff", year:2011, region:"FR", publisher:"Ubi Soft", desc:"续作。", tags:["ACT"]},
  {ip:"Rayman", title:"Rayman Legends (Game)", type:"game-spinoff", year:2013, region:"FR", publisher:"Ubi Soft", desc:"续作。", tags:["ACT"]},
  {ip:"Rayman", title:"Rayman Legends: Definitive Edition (Switch)", type:"game-spinoff", year:2017, region:"FR", publisher:"Ubi Soft", desc:"Switch 复刻。", tags:["ACT"]},
  {ip:"Rayman", title:"Rayman (Plush)", type:"merch-figure", year:1995, region:"FR", publisher:"Ubi Soft", desc:"毛绒。", tags:["毛绒"]},
  {ip:"Rayman", title:"Rayman OST", type:"ost", year:1995, region:"FR", publisher:"Ubi Soft", desc:"原声。", tags:["OST"]},
  {ip:"Rayman", title:"Rayman Legends OST", type:"ost", year:2013, region:"FR", publisher:"Ubi Soft", desc:"原声。", tags:["OST"]},

  // ============================================================
  // PRINCE OF PERSIA
  // ============================================================
  {ip:"Prince of Persia", title:"Prince of Persia: The Sands of Time (Film 2010)", type:"film-live", year:2010, region:"US", publisher:"Disney / Jerry Bruckheimer", desc:"真人电影。", tags:["真人电影"]},
  {ip:"Prince of Persia", title:"Prince of Persia: The Two Thrones (Game)", type:"game-spinoff", year:2005, region:"US", publisher:"Ubisoft", desc:"续作。", tags:["ACT"]},
  {ip:"Prince of Persia", title:"Prince of Persia (2008 Reboot)", type:"game-spinoff", year:2008, region:"US", publisher:"Ubisoft", desc:"续作。", tags:["ACT"]},
  {ip:"Prince of Persia", title:"Prince of Persia: The Forgotten Sands", type:"game-spinoff", year:2010, region:"US", publisher:"Ubisoft", desc:"续作。", tags:["ACT"]},
  {ip:"Prince of Persia", title:"Prince of Persia: Warrior Within (Game)", type:"game-spinoff", year:2004, region:"US", publisher:"Ubisoft", desc:"续作。", tags:["ACT"]},
  {ip:"Prince of Persia", title:"Prince of Persia (Manga)", type:"manga", year:2010, region:"US", publisher:"Disney", desc:"电影前传漫画。", tags:["美式漫画"]},
  {ip:"Prince of Persia", title:"Prince of Persia (Novel)", type:"novel", year:2010, region:"US", publisher:"Disney", desc:"小说。", tags:["小说"]},
  {ip:"Prince of Persia", title:"Prince of Persia: The Sands of Time OST (Stuart Chatwood)", type:"ost", year:2003, region:"US", publisher:"Ubisoft", desc:"原声。", tags:["OST"]},

  // ============================================================
  // THE SIMS (EA)
  // ============================================================
  {ip:"The Sims", title:"The Sims 2 (Game)", type:"game-spinoff", year:2004, region:"US", publisher:"EA", desc:"续作。", tags:["生活模拟"]},
  {ip:"The Sims", title:"The Sims 3 (Game)", type:"game-spinoff", year:2009, region:"US", publisher:"EA", desc:"续作。", tags:["生活模拟"]},
  {ip:"The Sims", title:"The Sims 4 (Game)", type:"game-spinoff", year:2014, region:"US", publisher:"EA", desc:"续作。", tags:["生活模拟"]},
  {ip:"The Sims", title:"The Sims Medieval (Game)", type:"game-spinoff", year:2011, region:"US", publisher:"EA", desc:"中世纪衍生。", tags:["生活模拟"]},
  {ip:"The Sims", title:"The Sims Stories (Game)", type:"game-spinoff", year:2007, region:"US", publisher:"EA", desc:"故事模式。", tags:["生活模拟"]},
  {ip:"The Sims", title:"MySims (Game)", type:"game-spinoff", year:2007, region:"US", publisher:"EA", desc:"简化版。", tags:["生活模拟"]},
  {ip:"The Sims", title:"The Sims FreePlay (Mobile)", type:"game-mobile", year:2011, region:"Global", publisher:"EA", desc:"手游。", tags:["手游"]},
  {ip:"The Sims", title:"The Sims Mobile (Mobile)", type:"game-mobile", year:2017, region:"Global", publisher:"EA", desc:"手游。", tags:["手游"]},
  {ip:"The Sims", title:"The Sims (Plush - Simlish Plush)", type:"merch-figure", year:2003, region:"US", publisher:"EA", desc:"毛绒。", tags:["毛绒"]},
  {ip:"The Sims", title:"The Sims (OST - Various)", type:"ost", year:2000, region:"US", publisher:"EA", desc:"原声。", tags:["OST"]},
  {ip:"The Sims", title:"The Sims (Manga - Simsons Stories)", type:"manga", year:2010, region:"US", publisher:"EA", desc:"漫画。", tags:["美式漫画"]},
  {ip:"The Sims", title:"The Sims (Nendoroid - Simlish)", type:"merch-figure", year:2020, region:"JP", publisher:"Good Smile", desc:"粘土人。", tags:["粘土人"]},
  {ip:"The Sims", title:"The Sims (Cosmetic - MAC Collection)", type:"merch-cloth", year:2022, region:"US", publisher:"MAC", desc:"化妆品联名。", tags:["化妆品"]},
  {ip:"The Sims", title:"The Sims (Alienware Bundle)", type:"merch-cloth", year:2018, region:"US", publisher:"Alienware", desc:"硬件联名。", tags:["硬件"]},

  // ============================================================
  // DEAD SPACE (EA)
  // ============================================================
  {ip:"Dead Space", title:"Dead Space 2 (Game)", type:"game-spinoff", year:2011, region:"US", publisher:"EA", desc:"续作。", tags:["生存恐怖"]},
  {ip:"Dead Space", title:"Dead Space 3 (Game)", type:"game-spinoff", year:2013, region:"US", publisher:"EA", desc:"续作。", tags:["生存恐怖"]},
  {ip:"Dead Space", title:"Dead Space Remake (2023)", type:"game-spinoff", year:2023, region:"US", publisher:"EA", desc:"重制。", tags:["重制"]},
  {ip:"Dead Space", title:"Dead Space 2 (Manga)", type:"manga", year:2010, region:"US", publisher:"Wildstorm", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Dead Space", title:"Dead Space: Martyr (Novel)", type:"novel", year:2010, region:"US", publisher:"Tor Books", desc:"前传小说。", tags:["小说"]},
  {ip:"Dead Space", title:"Dead Space: Salvage (Manga)", type:"manga", year:2010, region:"US", publisher:"Image Comics", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Dead Space", title:"Dead Space (OST - Jason Graves)", type:"ost", year:2008, region:"US", publisher:"EA", desc:"原声。", tags:["OST"]},
  {ip:"Dead Space", title:"Dead Space (Funko Pop - Isaac Clarke)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Dead Space", title:"Dead Space (Plasma Cutter Replica)", type:"merch-toy", year:2018, region:"US", publisher:"EA", desc:"等离子切割器复刻。", tags:["道具"]},
  {ip:"Dead Space", title:"Dead Space (Plush - Necromorph)", type:"merch-figure", year:2018, region:"US", publisher:"EA", desc:"毛绒。", tags:["毛绒"]},

  // ============================================================
  // APEX LEGENDS (EA)
  // ============================================================
  {ip:"Apex Legends", title:"Apex Legends (Game)", type:"game-spinoff", year:2019, region:"US", publisher:"EA", desc:"原版。", tags:["FPS"]},
  {ip:"Apex Legends", title:"Apex Legends Mobile", type:"game-mobile", year:2022, region:"Global", publisher:"EA", desc:"手游 (已停服)。", tags:["手游"]},
  {ip:"Apex Legends", title:"Apex Legends (Cinematic Trailers)", type:"web-series", year:2019, region:"US", publisher:"EA", desc:"CG 短片。", tags:["短片"]},
  {ip:"Apex Legends", title:"Apex Legends (Animated Short - Stories from the Outlands)", type:"web-series", year:2020, region:"US", publisher:"EA", desc:"动画短片。", tags:["短片"]},
  {ip:"Apex Legends", title:"Apex Legends (Manga - Pathfinder's Quest)", type:"manga", year:2021, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Apex Legends", title:"Apex Legends (Funko Pop - Wraith)", type:"merch-figure", year:2020, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Apex Legends", title:"Apex Legends (Funko Pop - Lifeline)", type:"merch-figure", year:2020, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Apex Legends", title:"Apex Legends (Action Figure - McFarlane)", type:"merch-figure", year:2020, region:"US", publisher:"McFarlane Toys", desc:"可动人偶。", tags:["可动"]},
  {ip:"Apex Legends", title:"Apex Legends OST (Various)", type:"ost", year:2019, region:"US", publisher:"EA", desc:"原声。", tags:["OST"]},
  {ip:"Apex Legends", title:"Apex Legends (Trading Card Game - Apex Legends TCG)", type:"merch-card", year:2022, region:"US", publisher:"EA", desc:"TCG。", tags:["TCG"]},
  {ip:"Apex Legends", title:"Apex Legends (Esports - ALGS)", type:"event", year:2020, region:"Global", publisher:"EA", desc:"电竞赛。", tags:["电竞赛"]},

  // ============================================================
  // NEED FOR SPEED
  // ============================================================
  {ip:"Need for Speed", title:"Need for Speed: Underground 2 (Game)", type:"game-spinoff", year:2004, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: Most Wanted (2005)", type:"game-spinoff", year:2005, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: Carbon (Game)", type:"game-spinoff", year:2006, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: ProStreet (Game)", type:"game-spinoff", year:2007, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: Shift (Game)", type:"game-spinoff", year:2009, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: Hot Pursuit (2010)", type:"game-spinoff", year:2010, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: The Run (Game)", type:"game-spinoff", year:2011, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: Rivals (Game)", type:"game-spinoff", year:2013, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed (2015 Reboot)", type:"game-spinoff", year:2015, region:"US", publisher:"EA", desc:"重启。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: Payback (Game)", type:"game-spinoff", year:2017, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: Heat (Game)", type:"game-spinoff", year:2019, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed: Unbound (Game)", type:"game-spinoff", year:2022, region:"US", publisher:"EA", desc:"续作。", tags:["赛车"]},
  {ip:"Need for Speed", title:"Need for Speed (Film 2014)", type:"film-live", year:2014, region:"US", publisher:"DreamWorks", desc:"真人电影。", tags:["真人电影"]},
  {ip:"Need for Speed", title:"Need for Speed (OST - Various)", type:"ost", year:2003, region:"US", publisher:"EA", desc:"原声。", tags:["OST"]},
  {ip:"Need for Speed", title:"Need for Speed: Heat OST", type:"ost", year:2019, region:"US", publisher:"EA", desc:"原声。", tags:["OST"]},
  {ip:"Need for Speed", title:"Need for Speed (Manga)", type:"manga", year:2014, region:"US", publisher:"Titan", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Need for Speed", title:"Need for Speed (Comic)", type:"manga", year:2014, region:"US", publisher:"Titan", desc:"电影前传漫画。", tags:["美式漫画"]},

  // ============================================================
  // FIFA / EA SPORTS FC
  // ============================================================
  {ip:"EA Sports FC", title:"EA Sports FC 24 (Game)", type:"game-spinoff", year:2023, region:"US", publisher:"EA Sports", desc:"FIFA 重启。", tags:["体育"]},
  {ip:"EA Sports FC", title:"EA Sports FC 25 (Game)", type:"game-spinoff", year:2024, region:"US", publisher:"EA Sports", desc:"续作。", tags:["体育"]},
  {ip:"EA Sports FC", title:"FIFA (Manga)", type:"manga", year:2002, region:"JP", publisher:"Shogakukan", desc:"漫画。", tags:["少年漫画"]},
  {ip:"EA Sports FC", title:"FIFA (OST - Various)", type:"ost", year:1993, region:"US", publisher:"EA Sports", desc:"原声。", tags:["OST"]},
  {ip:"EA Sports FC", title:"EA Sports FC Mobile", type:"game-mobile", year:2016, region:"Global", publisher:"EA Sports", desc:"手游。", tags:["手游"]},
  {ip:"EA Sports FC", title:"EA Sports FC Online (Korea)", type:"game-mobile", year:2017, region:"KR", publisher:"EA / Nexon", desc:"国服。", tags:["网游"]},

  // ============================================================
  // MADDEN
  // ============================================================
  {ip:"Madden NFL", title:"Madden NFL (Annual Series)", type:"game-spinoff", year:1988, region:"US", publisher:"EA Sports", desc:"年货。", tags:["体育"]},
  {ip:"Madden NFL", title:"Madden NFL Mobile (Mobile)", type:"game-mobile", year:2014, region:"US", publisher:"EA Sports", desc:"手游。", tags:["手游"]},
  {ip:"Madden NFL", title:"Madden NFL (OST)", type:"ost", year:2000, region:"US", publisher:"EA Sports", desc:"原声。", tags:["OST"]},

  // ============================================================
  // CIVILIZATION (2K / FIRAXIS)
  // ============================================================
  {ip:"Civilization", title:"Civilization III (Game)", type:"game-spinoff", year:2001, region:"US", publisher:"Firaxis", desc:"续作。", tags:["策略"]},
  {ip:"Civilization", title:"Civilization IV (Game)", type:"game-spinoff", year:2005, region:"US", publisher:"Firaxis", desc:"续作。", tags:["策略"]},
  {ip:"Civilization", title:"Civilization V (Game)", type:"game-spinoff", year:2010, region:"US", publisher:"Firaxis", desc:"续作。", tags:["策略"]},
  {ip:"Civilization", title:"Civilization VI (Game)", type:"game-spinoff", year:2016, region:"US", publisher:"Firaxis", desc:"续作。", tags:["策略"]},
  {ip:"Civilization", title:"Civilization VII (Game)", type:"game-spinoff", year:2025, region:"US", publisher:"Firaxis", desc:"新作。", tags:["策略"]},
  {ip:"Civilization", title:"Civilization Revolution (Game)", type:"game-spinoff", year:2008, region:"US", publisher:"Firaxis", desc:"简化版。", tags:["策略"]},
  {ip:"Civilization", title:"Civilization (Manga)", type:"manga", year:2016, region:"JP", publisher:"Shogakukan", desc:"漫画。", tags:["少年漫画"]},
  {ip:"Civilization", title:"Civilization: Beyond Earth (Game)", type:"game-spinoff", year:2014, region:"US", publisher:"Firaxis", desc:"续作。", tags:["策略"]},
  {ip:"Civilization", title:"Civilization: A New Dawn (Board Game)", type:"game-board", year:2017, region:"US", publisher:"Fantasy Flight", desc:"桌游。", tags:["桌游"]},
  {ip:"Civilization", title:"Civilization (OST - Christopher Tin)", type:"ost", year:2010, region:"US", publisher:"Firaxis", desc:"原声。", tags:["OST"]},
  {ip:"Civilization", title:"Civilization VI OST", type:"ost", year:2016, region:"US", publisher:"Firaxis", desc:"原声。", tags:["OST"]},
  {ip:"Civilization", title:"Civilization (Mug)", type:"merch-toy", year:2018, region:"US", publisher:"Firaxis", desc:"主题杯。", tags:["餐饮联动"]},
  {ip:"Civilization", title:"Civilization (Plush - Settler)", type:"merch-figure", year:2018, region:"US", publisher:"Firaxis", desc:"毛绒。", tags:["毛绒"]},

  // ============================================================
  // XCOM
  // ============================================================
  {ip:"XCOM", title:"XCOM: Enemy Unknown (Game)", type:"game-spinoff", year:2012, region:"US", publisher:"Firaxis", desc:"续作。", tags:["策略"]},
  {ip:"XCOM", title:"XCOM 2 (Game)", type:"game-spinoff", year:2016, region:"US", publisher:"Firaxis", desc:"续作。", tags:["策略"]},
  {ip:"XCOM", title:"XCOM: Chimera Squad (Game)", type:"game-spinoff", year:2020, region:"US", publisher:"Firaxis", desc:"续作。", tags:["策略"]},
  {ip:"XCOM", title:"The Bureau: XCOM Declassified (Game)", type:"game-spinoff", year:2013, region:"US", publisher:"2K Games", desc:"外传。", tags:["TPS"]},
  {ip:"XCOM", title:"XCOM (Manga)", type:"manga", year:2012, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"XCOM", title:"XCOM 2 OST (Timothy Michael Wynn)", type:"ost", year:2016, region:"US", publisher:"Firaxis", desc:"原声。", tags:["OST"]},

  // ============================================================
  // BIOSHOCK INFINITE / BAJ
  // ============================================================
  {ip:"BioShock", title:"BioShock Infinite: Industrial Revolution (Manga)", type:"manga", year:2013, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},

  // ============================================================
  // PORTAL (VALVE)
  // ============================================================
  {ip:"Portal", title:"Portal 2 (Game)", type:"game-spinoff", year:2011, region:"US", publisher:"Valve", desc:"续作。", tags:["益智"]},
  {ip:"Portal", title:"Portal (Manga - Peer Review)", type:"manga", year:2010, region:"US", publisher:"Valve", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Portal", title:"Portal 2 OST (Jonathan Coulton)", type:"ost", year:2011, region:"US", publisher:"Valve", desc:"原声。", tags:["OST"]},
  {ip:"Portal", title:"Portal (Plush - Weighted Companion Cube)", type:"merch-figure", year:2011, region:"US", publisher:"Valve", desc:"方块毛绒。", tags:["毛绒"]},
  {ip:"Portal", title:"Portal (Funko Pop - Chell)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Portal", title:"Portal (Aperture Science Mug)", type:"merch-toy", year:2011, region:"US", publisher:"Valve", desc:"主题杯。", tags:["餐饮联动"]},
  {ip:"Portal", title:"Portal (Companion Cube Replica)", type:"merch-toy", year:2012, region:"US", publisher:"Valve", desc:"复刻。", tags:["道具"]},

  // ============================================================
  // HALF-LIFE (VALVE)
  // ============================================================
  {ip:"Half-Life", title:"Half-Life 2 (Game)", type:"game-spinoff", year:2004, region:"US", publisher:"Valve", desc:"续作。", tags:["FPS"]},
  {ip:"Half-Life", title:"Half-Life 2: Episode One", type:"game-spinoff", year:2006, region:"US", publisher:"Valve", desc:"DLC。", tags:["DLC"]},
  {ip:"Half-Life", title:"Half-Life 2: Episode Two", type:"game-spinoff", year:2007, region:"US", publisher:"Valve", desc:"DLC。", tags:["DLC"]},
  {ip:"Half-Life", title:"Half-Life: Alyx (VR Game)", type:"game-spinoff", year:2020, region:"US", publisher:"Valve", desc:"VR 续作。", tags:["VR"]},
  {ip:"Half-Life", title:"Half-Life 2: The Orange Box", type:"game-spinoff", year:2007, region:"US", publisher:"Valve", desc:"合集。", tags:["合集"]},
  {ip:"Half-Life", title:"Half-Life (Manga - Raising the Bar)", type:"artbook", year:2004, region:"US", publisher:"Valve", desc:"画集。", tags:["画集"]},
  {ip:"Half-Life", title:"Half-Life (Comic - Half-Life: A Place in the West)", type:"manga", year:2014, region:"US", publisher:"Half-Life Comics", desc:"美式漫画。", tags:["美式漫画"]},
  {ip:"Half-Life", title:"Half-Life (Novel - Half-Life: The Random Access Modification)", type:"novel", year:2013, region:"US", publisher:"Valve", desc:"小说。", tags:["小说"]},
  {ip:"Half-Life", title:"Half-Life 2 OST (Kelly Bailey)", type:"ost", year:2004, region:"US", publisher:"Valve", desc:"原声。", tags:["OST"]},
  {ip:"Half-Life", title:"Half-Life: Alyx OST", type:"ost", year:2020, region:"US", publisher:"Valve", desc:"原声。", tags:["OST"]},
  {ip:"Half-Life", title:"Half-Life (Crowbar Replica)", type:"merch-toy", year:2018, region:"US", publisher:"Valve", desc:"撬棍复刻。", tags:["道具"]},
  {ip:"Half-Life", title:"Half-Life (Headcrab Plush)", type:"merch-figure", year:2018, region:"US", publisher:"Valve", desc:"头蟹毛绒。", tags:["毛绒"]},
  {ip:"Half-Life", title:"Half-Life (Funko Pop - Gordon Freeman)", type:"merch-figure", year:2019, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Half-Life", title:"Half-Life (Combine Helmet Replica)", type:"merch-toy", year:2018, region:"US", publisher:"Valve", desc:"头盔复刻。", tags:["道具"]},

  // ============================================================
  // DOTA 2 (VALVE)
  // ============================================================
  {ip:"Dota 2", title:"Dota: Dragon's Blood (Netflix Anime)", type:"anime", year:2021, region:"US", publisher:"Netflix / Valve", desc:"3 季动画。", tags:["动画"]},
  {ip:"Dota 2", title:"Dota 2 (Manga - Dota: Dragon's Blood)", type:"manga", year:2021, region:"US", publisher:"Dark Horse", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Dota 2", title:"Dota 2 (Action Figure - McFarlane)", type:"merch-figure", year:2019, region:"US", publisher:"McFarlane Toys", desc:"可动人偶。", tags:["可动"]},
  {ip:"Dota 2", title:"Dota 2 OST (Valve Studio Orchestra)", type:"ost", year:2013, region:"US", publisher:"Valve", desc:"原声。", tags:["OST"]},
  {ip:"Dota 2", title:"Dota 2 (Funko Pop - Juggernaut)", type:"merch-figure", year:2019, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Dota 2", title:"Dota 2 (Trading Card Game)", type:"merch-card", year:2018, region:"US", publisher:"Valve", desc:"TCG。", tags:["TCG"]},
  {ip:"Dota 2", title:"Dota 2 (The International Tournament)", type:"event", year:2011, region:"Global", publisher:"Valve", desc:"TI 比赛。", tags:["电竞赛"]},
  {ip:"Dota 2", title:"Dota 2 (Plush - Courier)", type:"merch-figure", year:2013, region:"US", publisher:"Valve", desc:"信使毛绒。", tags:["毛绒"]},

  // ============================================================
  // COUNTER-STRIKE (VALVE)
  // ============================================================
  {ip:"Counter-Strike", title:"Counter-Strike 1.6 (Game)", type:"game-spinoff", year:2000, region:"US", publisher:"Valve", desc:"经典版。", tags:["FPS"]},
  {ip:"Counter-Strike", title:"Counter-Strike: Source (Game)", type:"game-spinoff", year:2004, region:"US", publisher:"Valve", desc:"续作。", tags:["FPS"]},
  {ip:"Counter-Strike", title:"Counter-Strike: Global Offensive (Game)", type:"game-spinoff", year:2012, region:"US", publisher:"Valve", desc:"续作。", tags:["FPS"]},
  {ip:"Counter-Strike", title:"Counter-Strike 2 (Game)", type:"game-spinoff", year:2023, region:"US", publisher:"Valve", desc:"续作。", tags:["FPS"]},
  {ip:"Counter-Strike", title:"Counter-Strike (Manga - Global Offensive)", type:"manga", year:2012, region:"US", publisher:"Valve", desc:"漫画。", tags:["美式漫画"]},
  {ip:"Counter-Strike", title:"Counter-Strike (Funko Pop)", type:"merch-figure", year:2018, region:"US", publisher:"Funko", desc:"Funko 公仔。", tags:["Funko"]},
  {ip:"Counter-Strike", title:"Counter-Strike (Knife Replicas)", type:"merch-toy", year:2018, region:"US", publisher:"Valve", desc:"刀复刻。", tags:["道具"]},
  {ip:"Counter-Strike", title:"Counter-Strike OST", type:"ost", year:2000, region:"US", publisher:"Valve", desc:"原声。", tags:["OST"]},
  {ip:"Counter-Strike", title:"Counter-Strike (Major Tournament)", type:"event", year:2013, region:"Global", publisher:"Valve", desc:"Major 比赛。", tags:["电竞赛"]},
  {ip:"Counter-Strike", title:"Counter-Strike (Plush - Chicken)", type:"merch-figure", year:2018, region:"US", publisher:"Valve", desc:"鸡毛绒。", tags:["毛绒"]},
  ];
  window.DATA = window.DATA.concat(EXT);
})();
