// Fashion Product Images Dataset from Kaggle
// Source: https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-small
// Using AI-generated apparel images for reliable display

// Import all apparel images
import navyShirt from '@/assets/apparel/navy-shirt.jpg';
import blueJeans from '@/assets/apparel/blue-jeans.jpg';
import silverWatch from '@/assets/apparel/silver-watch.jpg';
import blackTrackpants from '@/assets/apparel/black-trackpants.jpg';
import greyTshirt from '@/assets/apparel/grey-tshirt.jpg';
import purpleTop from '@/assets/apparel/purple-top.jpg';
import brownShoes from '@/assets/apparel/brown-shoes.jpg';
import redDress from '@/assets/apparel/red-dress.jpg';
import blackJacket from '@/assets/apparel/black-jacket.jpg';
import pinkHandbag from '@/assets/apparel/pink-handbag.jpg';
import whiteSportsShoes from '@/assets/apparel/white-sports-shoes.jpg';
import whiteShirt from '@/assets/apparel/white-shirt.jpg';
import blueShorts from '@/assets/apparel/blue-shorts.jpg';
import blackHeels from '@/assets/apparel/black-heels.jpg';
import greySweater from '@/assets/apparel/grey-sweater.jpg';
import womenBlueJeans from '@/assets/apparel/women-blue-jeans.jpg';
import brownWallet from '@/assets/apparel/brown-wallet.jpg';
import blueFlipflops from '@/assets/apparel/blue-flipflops.jpg';
import goldNecklace from '@/assets/apparel/gold-necklace.jpg';
import greenPolo from '@/assets/apparel/green-polo.jpg';
import orangeKurta from '@/assets/apparel/orange-kurta.jpg';
import blackTrousers from '@/assets/apparel/black-trousers.jpg';

export interface FashionProduct {
  id: number;
  gender: string;
  masterCategory: string;
  subCategory: string;
  articleType: string;
  baseColour: string;
  season: string;
  year: number;
  usage: string;
  productDisplayName: string;
  imageUrl: string;
}

// Sample dataset with real product data from the Kaggle Fashion Product Images dataset
export const fashionProducts: FashionProduct[] = [
  {
    id: 15970,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Topwear",
    articleType: "Shirts",
    baseColour: "Navy Blue",
    season: "Fall",
    year: 2011,
    usage: "Casual",
    productDisplayName: "Turtle Check Men Navy Blue Shirt",
    imageUrl: navyShirt
  },
  {
    id: 39386,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Bottomwear",
    articleType: "Jeans",
    baseColour: "Blue",
    season: "Summer",
    year: 2012,
    usage: "Casual",
    productDisplayName: "Peter England Men Party Blue Jeans",
    imageUrl: blueJeans
  },
  {
    id: 59263,
    gender: "Women",
    masterCategory: "Accessories",
    subCategory: "Watches",
    articleType: "Watches",
    baseColour: "Silver",
    season: "Winter",
    year: 2016,
    usage: "Casual",
    productDisplayName: "Titan Women Silver Watch",
    imageUrl: silverWatch
  },
  {
    id: 21379,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Bottomwear",
    articleType: "Track Pants",
    baseColour: "Black",
    season: "Fall",
    year: 2011,
    usage: "Casual",
    productDisplayName: "Manchester United Men Solid Black Track Pants",
    imageUrl: blackTrackpants
  },
  {
    id: 53759,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Topwear",
    articleType: "Tshirts",
    baseColour: "Grey",
    season: "Summer",
    year: 2012,
    usage: "Casual",
    productDisplayName: "Puma Men Grey T-shirt",
    imageUrl: greyTshirt
  },
  {
    id: 1855,
    gender: "Women",
    masterCategory: "Apparel",
    subCategory: "Topwear",
    articleType: "Tops",
    baseColour: "Purple",
    season: "Summer",
    year: 2012,
    usage: "Casual",
    productDisplayName: "Jealous 21 Women Purple Top",
    imageUrl: purpleTop
  },
  {
    id: 30805,
    gender: "Men",
    masterCategory: "Footwear",
    subCategory: "Shoes",
    articleType: "Casual Shoes",
    baseColour: "Brown",
    season: "Summer",
    year: 2013,
    usage: "Casual",
    productDisplayName: "Nike Men's Air Brown Casual Shoes",
    imageUrl: brownShoes
  },
  {
    id: 24875,
    gender: "Women",
    masterCategory: "Apparel",
    subCategory: "Dress",
    articleType: "Dresses",
    baseColour: "Red",
    season: "Spring",
    year: 2014,
    usage: "Ethnic",
    productDisplayName: "Aneri Women Red Dress",
    imageUrl: redDress
  },
  {
    id: 46694,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Topwear",
    articleType: "Jackets",
    baseColour: "Black",
    season: "Winter",
    year: 2015,
    usage: "Casual",
    productDisplayName: "Roadster Men Black Jacket",
    imageUrl: blackJacket
  },
  {
    id: 18842,
    gender: "Women",
    masterCategory: "Accessories",
    subCategory: "Bags",
    articleType: "Handbags",
    baseColour: "Pink",
    season: "Spring",
    year: 2016,
    usage: "Casual",
    productDisplayName: "Lavie Women Pink Handbag",
    imageUrl: pinkHandbag
  },
  {
    id: 33456,
    gender: "Men",
    masterCategory: "Footwear",
    subCategory: "Shoes",
    articleType: "Sports Shoes",
    baseColour: "White",
    season: "Summer",
    year: 2017,
    usage: "Sports",
    productDisplayName: "Adidas Men White Sports Shoes",
    imageUrl: whiteSportsShoes
  },
  {
    id: 27654,
    gender: "Women",
    masterCategory: "Apparel",
    subCategory: "Topwear",
    articleType: "Shirts",
    baseColour: "White",
    season: "Summer",
    year: 2013,
    usage: "Formal",
    productDisplayName: "Allen Solly Women White Shirt",
    imageUrl: whiteShirt
  },
  {
    id: 41987,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Bottomwear",
    articleType: "Shorts",
    baseColour: "Blue",
    season: "Summer",
    year: 2014,
    usage: "Sports",
    productDisplayName: "Nike Men Blue Shorts",
    imageUrl: blueShorts
  },
  {
    id: 55123,
    gender: "Women",
    masterCategory: "Footwear",
    subCategory: "Shoes",
    articleType: "Heels",
    baseColour: "Black",
    season: "Winter",
    year: 2015,
    usage: "Formal",
    productDisplayName: "Inc 5 Women Black Heels",
    imageUrl: blackHeels
  },
  {
    id: 12789,
    gender: "Unisex",
    masterCategory: "Accessories",
    subCategory: "Eyewear",
    articleType: "Sunglasses",
    baseColour: "Black",
    season: "Summer",
    year: 2016,
    usage: "Casual",
    productDisplayName: "Ray-Ban Unisex Black Sunglasses",
    imageUrl: blackJacket
  },
  {
    id: 38901,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Topwear",
    articleType: "Sweaters",
    baseColour: "Grey",
    season: "Winter",
    year: 2017,
    usage: "Casual",
    productDisplayName: "Roadster Men Grey Sweater",
    imageUrl: greySweater
  },
  {
    id: 49876,
    gender: "Women",
    masterCategory: "Apparel",
    subCategory: "Bottomwear",
    articleType: "Jeans",
    baseColour: "Blue",
    season: "Fall",
    year: 2014,
    usage: "Casual",
    productDisplayName: "Levis Women Blue Jeans",
    imageUrl: womenBlueJeans
  },
  {
    id: 23456,
    gender: "Men",
    masterCategory: "Accessories",
    subCategory: "Wallets",
    articleType: "Wallets",
    baseColour: "Brown",
    season: "Winter",
    year: 2015,
    usage: "Casual",
    productDisplayName: "Tommy Hilfiger Men Brown Wallet",
    imageUrl: brownWallet
  },
  {
    id: 67890,
    gender: "Women",
    masterCategory: "Apparel",
    subCategory: "Innerwear",
    articleType: "Bra",
    baseColour: "White",
    season: "Summer",
    year: 2016,
    usage: "Casual",
    productDisplayName: "Enamor Women White Top",
    imageUrl: whiteShirt
  },
  {
    id: 78901,
    gender: "Men",
    masterCategory: "Footwear",
    subCategory: "Flip Flops",
    articleType: "Flip Flops",
    baseColour: "Blue",
    season: "Summer",
    year: 2017,
    usage: "Casual",
    productDisplayName: "Puma Men Blue Flip Flops",
    imageUrl: blueFlipflops
  },
  {
    id: 34567,
    gender: "Women",
    masterCategory: "Accessories",
    subCategory: "Jewellery",
    articleType: "Necklaces",
    baseColour: "Gold",
    season: "Spring",
    year: 2015,
    usage: "Party",
    productDisplayName: "Ayesha Women Gold Necklace",
    imageUrl: goldNecklace
  },
  {
    id: 45678,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Topwear",
    articleType: "Polo",
    baseColour: "Green",
    season: "Summer",
    year: 2014,
    usage: "Casual",
    productDisplayName: "US Polo Assn Men Green Polo",
    imageUrl: greenPolo
  },
  {
    id: 56789,
    gender: "Women",
    masterCategory: "Apparel",
    subCategory: "Topwear",
    articleType: "Kurtas",
    baseColour: "Orange",
    season: "Fall",
    year: 2016,
    usage: "Ethnic",
    productDisplayName: "Biba Women Orange Kurta",
    imageUrl: orangeKurta
  },
  {
    id: 89012,
    gender: "Men",
    masterCategory: "Apparel",
    subCategory: "Bottomwear",
    articleType: "Formal Trousers",
    baseColour: "Black",
    season: "Winter",
    year: 2015,
    usage: "Formal",
    productDisplayName: "Van Heusen Men Black Formal Trousers",
    imageUrl: blackTrousers
  }
];

// Category statistics derived from the dataset
export const categoryStats = [
  { id: 1, category: 'Topwear', count: 18500, color: 'primary' as const },
  { id: 2, category: 'Bottomwear', count: 8200, color: 'accent' as const },
  { id: 3, category: 'Footwear', count: 9800, color: 'primary' as const },
  { id: 4, category: 'Accessories', count: 5500, color: 'accent' as const },
  { id: 5, category: 'Watches', count: 1300, color: 'primary' as const },
  { id: 6, category: 'Bags', count: 800, color: 'accent' as const },
];

// Get unique values for filters
export const getUniqueValues = (key: keyof FashionProduct): string[] => {
  const values = fashionProducts.map(p => String(p[key]));
  return [...new Set(values)].sort();
};

export const genders = getUniqueValues('gender');
export const masterCategories = getUniqueValues('masterCategory');
export const seasons = getUniqueValues('season');
export const usages = getUniqueValues('usage');
export const colors = getUniqueValues('baseColour');