import { KyselyDB } from "@seed/seed/db";
import { SeedCustomers } from "@seed/data/customers";
import { SeedProducts } from "@seed/data/products/products";

export type SeedReviews = ReturnType<typeof generateReviews>;

export function generateReviews({ products }: { products: SeedProducts }) {
  const reviews = {
    men: {
      [products.men.tops.polo.ids["Short Sleeve Polo"].id]: [
        {
          comment:
            "The Short Sleeve Polo is a classic wardrobe staple! It's versatile and comfortable, making it perfect for everyday wear. I love the quality of the fabric and the relaxed fit.",
          rating: 5,
        },
        {
          comment:
            "This Short Sleeve Polo is fantastic! The material is breathable, and it's ideal for warm weather. I bought it in two colors because I love it so much. Definitely a must-have in any closet!",
          rating: 5,
        },
        {
          comment:
            "I can't get enough of the Short Sleeve Polo! It's so easy to style and can be dressed up or down. The short sleeves make it perfect for casual days, and the fit is just right. Highly recommend!",
          rating: 5,
        },
        {
          comment:
            "I'm in love with the Short Sleeve Polo! It's my go-to for casual outings. The fabric is soft, and the fit is relaxed. I bought one in every color – that's how much I adore it!",
          rating: 5,
        },
        {
          comment:
            "The Short Sleeve Polo is okay, but the quality could be better. After a few washes, I noticed some fading, and the fabric doesn't feel as durable as I would like. Decent for the price.",
          rating: 4,
        },
        {
          comment:
            "I'm a repeat customer for the Short Sleeve Polo. It's comfortable, versatile, and easy to style. Perfect for lazy weekends or a quick brunch with friends. Highly recommended!",
          rating: 5,
        },
      ],
      [products.men.tops.polo.ids["Slim Fit Dotted Polo"].id]: [
        {
          comment:
            "I absolutely love the Slim Fit Dotted Polo! The fit is perfect, and the dotted design adds a stylish touch. It's my go-to choice for casual outings. Highly recommended!",
          rating: 5,
        },
        {
          comment:
            "The quality of the Slim Fit Dotted Polo exceeded my expectations. The fit is slim and flattering, and the dotted pattern gives it a unique and trendy look. Great addition to my wardrobe!",
          rating: 5,
        },
        {
          comment:
            "I recently purchased the Slim Fit Dotted Polo, and I'm thrilled with it! The slim fit is modern and chic, and the dotted design adds a playful element. Comfortable and stylish – a winning combination!",
          rating: 5,
        },
        {
          comment:
            "The Slim Fit Dotted Polo is a great addition to my wardrobe. The fit is slim without being too tight, and the dotted pattern adds a touch of elegance. Love it!",
          rating: 5,
        },
        {
          comment:
            "I'm a bit disappointed with the Slim Fit Dotted Polo. The fit is tighter than expected, and the material feels a bit scratchy on the skin. Not as comfortable as I had hoped.",
          rating: 3,
        },
        {
          comment:
            "I received many compliments when I wore the Slim Fit Dotted Polo to a party. The design is eye-catching, and the fit is just right. Definitely a statement piece in my collection!",
          rating: 4,
        },
      ],
      [products.men.tops.polo.ids["Vito Willy Polo"].id]: [
        {
          comment:
            "The Vito Willy Polo is a game-changer! The design is modern and eye-catching, and the quality is top-notch. I always get compliments when I wear it. A must-have for fashion-forward individuals!",
          rating: 5,
        },
        {
          comment:
            "I'm impressed with the Vito Willy Polo! The attention to detail in the design is outstanding. It's comfortable to wear and adds a touch of sophistication to any outfit. I highly recommend it!",
          rating: 5,
        },
        {
          comment:
            "Vito Willy Polo is a showstopper! I love the unique style and how it stands out. The fit is excellent, and the fabric is durable. If you want to make a statement with your fashion, this is the polo for you!",
          rating: 5,
        },
        {
          comment:
            "The Vito Willy Polo exceeded my expectations! The design is unique, and the fit is impeccable. I've never owned a polo that garnered so much attention. Worth every penny!",
          rating: 5,
        },
        {
          comment:
            "I regret purchasing the Vito Willy Polo. The design, though unique, feels a bit too flashy for my taste. The fabric is also not as soft as I would prefer. Not my best buy.",
          rating: 3,
        },
        {
          comment:
            "I wore the Vito Willy Polo to a special event, and it was a hit! The compliments kept coming, and I felt confident in the stylish design. A bold choice for those who want to stand out!",
          rating: 5,
        },
      ],
      [products.men.tops.tshirt.ids["Regular Fit Crew-neck T-Shirt"].id]: [
        {
          comment:
            "The Regular Fit Crew-neck T-Shirt is a classic! It's comfortable, and the fit is just right. Perfect for everyday wear.",
          rating: 5,
        },
        {
          comment:
            "I love the simplicity of the Regular Fit Crew-neck T-Shirt. It's soft, easy to style, and a must-have in any casual wardrobe.",
          rating: 5,
        },
        {
          comment:
            "This Regular Fit Crew-neck T-Shirt is my favorite go-to tee. The fit is comfortable, and the material is durable. Great value for the price!",
          rating: 5,
        },
        {
          comment:
            "I'm not a fan of the Regular Fit Crew-neck T-Shirt. The fit is too loose for my liking, and the fabric feels a bit cheap. Disappointed with the purchase.",
          rating: 4,
        },
        {
          comment:
            "The Regular Fit Crew-neck T-Shirt is perfect for a relaxed look. The fit is just right, and it's great for layering. I have it in multiple colors!",
          rating: 5,
        },
      ],
      [products.men.tops.tshirt.ids["Oversized Round-neck T-Shirt"].id]: [
        {
          comment:
            "I'm obsessed with the Oversized Round-neck T-Shirt! The fit is trendy, and it's so comfortable to wear. A must-have for anyone who loves oversized fashion.",
          rating: 5,
        },
        {
          comment:
            "The Oversized Round-neck T-Shirt is my new favorite! It's stylish, and the fit is just what I was looking for. I bought it in two colors, and I'm thinking about getting more!",
          rating: 5,
        },
        {
          comment:
            "I expected the Oversized Round-neck T-Shirt to be more oversized. It's just a bit looser than a regular fit. However, the quality is good, and it's still a nice addition to my wardrobe.",
          rating: 4,
        },
        {
          comment:
            "The Oversized Round-neck T-Shirt is not my style. The fit is too baggy, and it looks unflattering. I was hoping for a more fashionable oversized look.",
          rating: 3,
        },
        {
          comment:
            "This Oversized Round-neck T-Shirt is a game-changer! The fit is perfect, and it's so versatile. I wear it with jeans or leggings for a casual, chic look.",
          rating: 5,
        },
      ],
      [products.men.tops.tshirt.ids["Relaxed Sleeveless T-Shirt"].id]: [
        {
          comment:
            "The Relaxed Sleeveless T-Shirt is a summer essential! It's comfortable, and the relaxed fit is perfect for hot days. I love the casual vibe.",
          rating: 5,
        },
        {
          comment:
            "I'm in love with the Relaxed Sleeveless T-Shirt! The fit is just right, and it's so easy to pair with shorts or jeans. Great for a laid-back, stylish look.",
          rating: 5,
        },
        {
          comment:
            "The Relaxed Sleeveless T-Shirt is a bit too loose for my liking, but it's great for a casual, breezy look. The fabric is soft and comfortable.",
          rating: 4,
        },
        {
          comment:
            "I was expecting the Relaxed Sleeveless T-Shirt to be more fitted. It's too baggy for my taste, and the armholes are a bit too big. Not my favorite.",
          rating: 3,
        },
        {
          comment:
            "I love the Relaxed Sleeveless T-Shirt for lounging around or running errands. The fit is relaxed, and the fabric is breathable. It's a go-to for a casual day out.",
          rating: 5,
        },
      ],

      [products.men.jeans.ids["Ultra Stretch Jeans"].id]: [
        {
          comment:
            "The Ultra Stretch Jeans are a game-changer! They're so comfortable and stretchy. The fit is perfect, and they're my new favorite pair of jeans.",
          rating: 5,
        },
        {
          comment:
            "I'm impressed with the Ultra Stretch Jeans! The fit is fantastic, and the stretch makes them super comfortable. I highly recommend them.",
          rating: 5,
        },
        {
          comment:
            "The Ultra Stretch Jeans are a bit too tight for my liking. While they stretch, they feel restrictive, especially around the waist. Consider sizing up for a more comfortable fit.",
          rating: 3,
        },
        {
          comment:
            "I expected more stretch from the Ultra Stretch Jeans. They're comfortable, but I've had stretchier jeans before. The fit is good, but the name is a bit misleading.",
          rating: 4,
        },
        {
          comment:
            "The Ultra Stretch Jeans are perfect for all-day wear! The fit is great, and the stretch makes them easy to move in. I'll be buying them in other colors too!",
          rating: 5,
        },
      ],
      [products.men.jeans.ids["Slim Fit Jeans"].id]: [
        {
          comment:
            "The Slim Fit Jeans are my go-to for a stylish look. The fit is slim without being too tight, and the quality is excellent. Highly recommend!",
          rating: 5,
        },
        {
          comment:
            "I love the Slim Fit Jeans! They're comfortable, and the slim fit is flattering. Perfect for dressing up or down. I have them in multiple washes.",
          rating: 5,
        },
        {
          comment:
            "The Slim Fit Jeans are a bit too long for my liking. While the fit is good around the waist and hips, I'll need to hem them. Consider offering different inseam lengths.",
          rating: 4,
        },
        {
          comment:
            "I expected the Slim Fit Jeans to be more stretchy. While the fit is slim, they're not as flexible as I hoped. Still, they look great and are good for a night out.",
          rating: 4,
        },
        {
          comment:
            "The Slim Fit Jeans are my favorite pair! The fit is perfect, and they're versatile enough for any occasion. The quality is top-notch. Definitely a wardrobe staple.",
          rating: 5,
        },
      ],
      [products.men.jeans.ids["Jeans shorts"].id]: [
        {
          comment:
            "These Jeans Shorts are a summer essential! The fit is just right, and they're so comfortable. Great for a casual, laid-back look.",
          rating: 5,
        },
        {
          comment:
            "I'm loving these Jeans Shorts! The fit is fantastic, and they're my go-to for hot days. The quality is excellent, and they're easy to style.",
          rating: 5,
        },
        {
          comment:
            "The Jeans Shorts are a bit too tight around the thighs for my liking. While they're comfortable, I would prefer a looser fit. Consider sizing up.",
          rating: 4,
        },
        {
          comment:
            "I expected the Jeans Shorts to be a bit longer. They're almost too short for my taste. The fit is good, but a little more length would be perfect.",
          rating: 5,
        },
        {
          comment:
            "These Jeans Shorts are my favorite! The fit is great, and they're so versatile. I wear them with tees, tanks, and even blouses. Definitely a summer wardrobe staple.",
          rating: 5,
        },
      ],
      [products.men.jeans.ids["Wide Fit Jeans"].id]: [
        {
          comment:
            "I'm loving the Wide Fit Jeans! The fit is trendy and comfortable. It's a nice change from the usual slim fit. Highly recommend for a relaxed look.",
          rating: 5,
        },
        {
          comment:
            "The Wide Fit Jeans are my new favorites! The fit is just what I was looking for—loose and comfortable. Perfect for a laid-back, casual style.",
          rating: 5,
        },
        {
          comment:
            "The Wide Fit Jeans are too baggy for my liking. I expected a looser fit, but these are almost too much. Consider offering a slightly slimmer wide fit option.",
          rating: 4,
        },
        {
          comment:
            "I was hoping for a wider leg with the Wide Fit Jeans. While they're comfortable, the fit is not as wide as I anticipated. Decent, but not exactly what I was looking for.",
          rating: 4,
        },
        {
          comment:
            "These Wide Fit Jeans are a breath of fresh air! The fit is wide without being overwhelming, and they're so comfortable. A great addition to my wardrobe.",
          rating: 5,
        },
      ],
      [products.men.shorts.ids["Chinos shorts"].id]: [
        {
          comment:
            "The Chinos Shorts are a must-have for summer! The fit is just right, and they're so versatile. Great for a polished casual look.",
          rating: 5,
        },
        {
          comment:
            "I'm impressed with the quality of the Chinos Shorts! The fit is comfortable, and they're perfect for a day out or a casual dinner. Highly recommend.",
          rating: 5,
        },
        {
          comment:
            "The Chinos Shorts are a bit too tight around the waist for me. While the fit is good in the legs, the waistband is a bit restrictive. Consider sizing up for a more comfortable fit.",
          rating: 4,
        },
        {
          comment:
            "I expected the Chinos Shorts to be a bit longer. They're almost too short for my liking. The fit is good, but a little more length would be perfect.",
          rating: 4,
        },
        {
          comment:
            "These Chinos Shorts are my go-to for a polished casual look! The fit is great, and they're easy to dress up or down. Definitely a summer wardrobe essential.",
          rating: 5,
        },
      ],
      [products.men.shorts.ids["Relaxed Striped Shorts"].id]: [
        {
          comment:
            "The Relaxed Striped Shorts are a summer favorite! The fit is relaxed, and the striped pattern adds a playful touch. I love pairing them with a simple tee for a laid-back look.",
          rating: 5,
        },
        {
          comment:
            "I'm loving the Relaxed Striped Shorts! The fit is just right, and the stripes give them a nautical vibe. Great for a beach day or a casual outing.",
          rating: 5,
        },
        {
          comment:
            "The Relaxed Striped Shorts are a bit too baggy for my liking. While they're comfortable, I would prefer a slightly slimmer fit. Consider offering a more tailored option.",
          rating: 4,
        },
        {
          comment:
            "I expected the Relaxed Striped Shorts to be a bit longer. They're almost too short for my taste. The fit is good, but a little more length would be perfect.",
          rating: 4,
        },
        {
          comment:
            "These Relaxed Striped Shorts are my go-to for a casual day out! The fit is great, and the stripes add a fun element. I pair them with sandals for the perfect summer look.",
          rating: 5,
        },
      ],
    },
    women: {
      [products.women.tops.shirt.ids[
        "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)"
      ].id]: [
        {
          comment:
            "The NORMAL IS BORING Graphic T-Shirt is a bold statement piece! The fit is great, and the graphic adds a rebellious touch. Perfect for those who embrace their uniqueness.",
          rating: 5,
        },
        {
          comment:
            "I'm in love with the NORMAL IS BORING Graphic T-Shirt! The fit is fantastic, and the message resonates with my style. A must-have for anyone who dares to be different.",
          rating: 5,
        },
        {
          comment:
            "The NORMAL IS BORING Graphic T-Shirt is a bit too edgy for my taste. While I appreciate the message, I would prefer a more subtle design. The fit is good, though.",
          rating: 4,
        },
        {
          comment:
            "I was hoping for a more durable print with the NORMAL IS BORING Graphic T-Shirt. It started fading after a few washes, and I expected better quality. The fit is great, though.",
          rating: 4,
        },
        {
          comment:
            "This NORMAL IS BORING Graphic T-Shirt is a conversation starter! The fit is fantastic, and the message is empowering.",
          rating: 5,
        },
      ],
      [products.women.tops.shirt.ids["Striped Short-Sleeve T-Shirt"].id]: [
        {
          comment:
            "The Striped Short-Sleeve T-Shirt is a classic! I love the timeless appeal of stripes, and the fit is just right. A must-have for casual, everyday wear.",
          rating: 5,
        },
        {
          comment:
            "I'm loving the Striped Short-Sleeve T-Shirt! The fit is fantastic, and the striped pattern adds a playful element. Great for pairing with jeans or shorts.",
          rating: 5,
        },
        {
          comment:
            "The Striped Short-Sleeve T-Shirt is a bit too short for my liking. I expected a longer length. While the fit is good, I prefer tees with a bit more coverage.",
          rating: 4,
        },
        {
          comment:
            "I was hoping for a more vibrant color in the Striped Short-Sleeve T-Shirt. The stripes are a bit muted, and I wanted something more eye-catching. The fit is good, though.",
          rating: 4,
        },
        {
          comment:
            "This Striped Short-Sleeve T-Shirt is a staple in my wardrobe! The fit is great, and the stripes are a classic touch. I wear it for casual days and layer it for a chic look.",
          rating: 5,
        },
      ],
      [products.women.tops.shirt.ids["USA Gray Mini T-Shirt"].id]: [
        {
          comment:
            "The USA Gray Mini T-Shirt is a fun addition to my wardrobe! The fit is great, and the USA graphic adds a playful touch. Perfect for celebrating any occasion.",
          rating: 5,
        },
        {
          comment:
            "I'm obsessed with the USA Gray Mini T-Shirt! The fit is fantastic, and the graphic is a conversation starter. I get compliments every time I wear it.",
          rating: 5,
        },
        {
          comment:
            "The USA Gray Mini T-Shirt is a bit too snug for my liking. While I love the graphic, I would prefer a slightly looser fit. Consider offering a more relaxed option.",
          rating: 4,
        },
        {
          comment:
            "I was hoping for a softer fabric with the USA Gray Mini T-Shirt. It's a bit scratchy on the skin, and I expected a more comfortable feel. The fit is good, though.",
          rating: 4,
        },
        {
          comment:
            "This USA Gray Mini T-Shirt is my go-to for a casual look! The fit is great, and the graphic adds a playful element. I wear it for holidays and events.",
          rating: 5,
        },
      ],

      [products.women.tops.blouse.ids["Creped blouse with tie"].id]: [
        {
          comment:
            "The Creped Blouse with Tie is a versatile piece! I love how the tie detail adds a touch of sophistication. The fit is comfortable, and it's perfect for both work and casual outings.",
          rating: 5,
        },
        {
          comment:
            "I'm impressed with the quality of the Creped Blouse with Tie! The fit is just right, and the tie detail elevates the overall look. Highly recommend for a polished style.",
          rating: 5,
        },
        {
          comment:
            "The Creped Blouse with Tie is a bit too short for my liking. I expected a longer length. The tie detail is lovely, but I would prefer more coverage. Consider offering a longer version.",
          rating: 5,
        },
        {
          comment:
            "I was hoping for a more tailored fit with the Creped Blouse with Tie. It's a bit boxy on me, and I would prefer a more defined silhouette. The tie detail is cute, though.",
          rating: 4,
        },
        {
          comment:
            "This Creped Blouse with Tie is a wardrobe essential! The fit is great, and the tie detail adds a feminine touch. I wear it to work and for casual outings. A versatile piece.",
          rating: 5,
        },
      ],
      [products.women.tops.blouse.ids["Pleated Long Sleeve Blouse"].id]: [
        {
          comment:
            "The Pleated Long Sleeve Blouse is a feminine delight! The pleats add a beautiful texture, and the fit is flattering. I receive compliments every time I wear it.",
          rating: 5,
        },
        {
          comment:
            "I'm in love with the Pleated Long Sleeve Blouse! The fit is just right, and the pleated detailing gives it an elegant touch. Perfect for a dressy occasion or a night out.",
          rating: 5,
        },
        {
          comment:
            "The Pleated Long Sleeve Blouse is a bit too tight around the bust for my liking. While the pleats are lovely, I would prefer a more relaxed fit. Consider offering a looser option.",
          rating: 4,
        },
        {
          comment:
            "I expected the Pleated Long Sleeve Blouse to have a more breathable fabric. It feels a bit restrictive, especially in warmer weather. The pleats are beautiful, but comfort is important too.",
          rating: 4,
        },
        {
          comment:
            "This Pleated Long Sleeve Blouse is a stunner! The fit is great, and the pleated detailing adds a sophisticated touch. I wear it for special occasions and always feel elegant.",
          rating: 5,
        },
      ],
      [products.women.tops.blouse.ids["Floral Long Sleeve Blouse"].id]: [
        {
          comment:
            "The Floral Long Sleeve Blouse is a wardrobe standout! The floral pattern is vibrant, and the fit is feminine. I receive compliments every time I wear it.",
          rating: 5,
        },
        {
          comment:
            "I'm in love with the Floral Long Sleeve Blouse! The fit is just right, and the floral print adds a touch of elegance. Perfect for both casual and dressy occasions.",
          rating: 5,
        },
        {
          comment:
            "The Floral Long Sleeve Blouse is a bit too sheer for my liking. I had to wear a camisole underneath to feel comfortable. Consider using a slightly thicker fabric for future designs.",
          rating: 4,
        },
        {
          comment:
            "I expected the Floral Long Sleeve Blouse to have a more tailored fit. It's a bit boxy on me. While the floral pattern is beautiful, the fit could be more flattering.",
          rating: 4,
        },
        {
          comment:
            "This Floral Long Sleeve Blouse is a showstopper! The fit is great, and the floral print is perfect for adding a pop of color to any outfit. A must-have for floral lovers.",
          rating: 5,
        },
      ],

      [products.women.jeans.ids["Ultra Stretch Jeans (Damaged)"].id]: [
        {
          comment:
            "The Ultra Stretch Jeans (Damaged) are my new favorites! The distressed look adds a trendy edge, and the stretchy fabric makes them incredibly comfortable. Perfect for a casual and cool vibe.",
          rating: 5,
        },
        {
          comment:
            "I was hesitant about the damaged look, but these Ultra Stretch Jeans won me over! They fit like a dream and have just the right amount of distressing. A stylish choice for a laid-back day.",
          rating: 5,
        },
        {
          comment:
            "Not a fan of the damaged trend, but these Ultra Stretch Jeans surprised me. The fit is fantastic, and the distressed details are subtle enough to add character without being overwhelming. Comfortable and stylish.",
          rating: 5,
        },
        {
          comment:
            "I love the Ultra Stretch Jeans (Damaged)! The distressed elements give them a rock-chic vibe, and the stretchy fabric is a game-changer. Definitely a must-have for those who want to elevate their denim game.",
          rating: 5,
        },
        {
          comment:
            "Ultra Stretch Jeans (Damaged) are a fashion statement! The distressed features are on point, and they fit like a glove. Great for a relaxed, edgy look. Highly recommend for those who love bold denim styles.",
          rating: 5,
        },
      ],
      [products.women.jeans.ids["Wide Fit Jeans (High Waist)"].id]: [
        {
          comment:
            "Wide Fit Jeans (Women) are a dream come true! Finally, jeans that are stylish and comfortable. The wide fit gives them a chic, laid-back look. Perfect for casual outings or dressing up with heels.",
          rating: 5,
        },
        {
          comment:
            "I'm loving the Wide Fit Jeans (Women)! The style is so on-trend, and the fit is incredibly flattering. The wide leg adds a touch of sophistication. A versatile pair that can be dressed up or down.",
          rating: 5,
        },
        {
          comment:
            "Wide Fit Jeans (Women) are my new go-to! The wide leg is not only fashionable but also comfortable. I can move freely, and they look great with both sneakers and heels. A definite wardrobe staple!",
          rating: 5,
        },
        {
          comment:
            "Not a fan of the wide leg trend, but these Wide Fit Jeans surprised me. The fit is excellent, and they are surprisingly versatile. Dress them up with a blouse or keep it casual with a tee. Great addition to my closet.",
          rating: 5,
        },
        {
          comment:
            "Wide Fit Jeans (Women) are a game-changer! The wide leg is stylish and makes a statement. The fit is fantastic, and they are perfect for creating a trendy, fashion-forward look. Highly recommended!",
          rating: 5,
        },
      ],

      [products.women.skirts.ids["Long floral skirt"].id]: [
        {
          comment:
            "The Long Floral Skirt is a showstopper! The print is vibrant and feminine, and the length is perfect. I feel so elegant and chic when I wear it. A beautiful addition to my wardrobe!",
          rating: 5,
        },
        {
          comment:
            "I'm in love with the Long Floral Skirt! The floral pattern is so pretty, and the length is just right. It's versatile enough to wear casually or dress up for a special occasion. Definitely a wardrobe favorite.",
          rating: 5,
        },
        {
          comment:
            "The Long Floral Skirt is a must-have for any fashion lover! The floral print is timeless, and the length adds an elegant touch. I've received so many compliments every time I wear it. Absolutely stunning!",
          rating: 5,
        },
        {
          comment:
            "The Long Floral Skirt exceeded my expectations! The quality is excellent, and the floral print is even more beautiful in person. It's comfortable and flowy - perfect for summer days or dressed-up evenings.",
          rating: 5,
        },
        {
          comment:
            "I adore the Long Floral Skirt! It's such a feminine and versatile piece. The floral pattern is lovely, and the length is just right. I feel confident and stylish whenever I wear it. Highly recommend!",
          rating: 5,
        },
      ],
      [products.women.skirts.ids["Red checked skirt"].id]: [
        {
          comment:
            "The Red Checked Skirt is a fun and stylish choice! The checked pattern adds a playful touch, and the red color is bold and eye-catching. It's a statement piece that's perfect for any fashion-forward wardrobe.",
          rating: 5,
        },
        {
          comment:
            "I'm obsessed with the Red Checked Skirt! The pattern is trendy, and the fit is fantastic. It's a versatile piece that can be dressed up or down. I've received so many compliments on it already!",
          rating: 5,
        },
        {
          comment:
            "The Red Checked Skirt is a standout in my closet! The red checks are vibrant, and the fit is flattering. It's great for adding a pop of color to any outfit. I highly recommend it to those who love bold fashion.",
          rating: 5,
        },
        {
          comment:
            "Not a fan of bold patterns, but the Red Checked Skirt surprised me. The fit is comfortable, and the checks add a playful element without being too overwhelming. It's become a go-to piece in my wardrobe.",
          rating: 5,
        },
        {
          comment:
            "The Red Checked Skirt is a winner! The pattern is bold, and the fit is stylish. It's a versatile piece that can be paired with a variety of tops. I love how it adds a touch of personality to my outfits.",
          rating: 5,
        },
      ],
      [products.women.skirts.ids["Short Sequin Skirt"].id]: [
        {
          comment:
            "The Short Sequin Skirt is a show-stopper! The sequins add a touch of glamour, and the length is perfect for a night out. I feel like a million bucks whenever I wear it. A must-have for party lovers!",
          rating: 5,
        },
        {
          comment:
            "I'm in love with the Short Sequin Skirt! The sequins sparkle beautifully, and the fit is fantastic. It's the perfect skirt for a special occasion or a night on the town. I've gotten so many compliments!",
          rating: 5,
        },
        {
          comment:
            "The Short Sequin Skirt is a statement piece in my wardrobe! The sequins catch the light in the most beautiful way, and the fit is both comfortable and flattering. I can't wait to wear it to my next event.",
          rating: 5,
        },
        {
          comment:
            "The Short Sequin Skirt exceeded my expectations! The sequins are high-quality and add a touch of luxury. The fit is great, and it's surprisingly comfortable for a sequin skirt. Definitely worth the investment.",
          rating: 5,
        },
        {
          comment:
            "Short Sequin Skirt is a show-stopper! I wore it to a party, and I felt like the belle of the ball. The sequins are well-attached, and the fit is perfect. If you want to turn heads, this is the skirt to wear!",
          rating: 5,
        },
      ],
    },
  };

  return reviews;
}
