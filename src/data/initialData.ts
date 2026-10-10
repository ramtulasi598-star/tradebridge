import {
  CropInfo,
  CropListing,
  MarketPrice,
  MarketRequirement,
  Deal,
  SellRequest,
  UserProfile,
  LocationInfo,
  MarketHub
} from '../types/marketplace';

export const INITIAL_CROPS: CropInfo[] = [
  {
    id: 'crop-tomato',
    nameKey: 'Tomato',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🍅',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Super / Export)',
        description: 'Firm, uniform red, zero blemishes, 60-70mm diameter',
        criteria: ['Firmness > 95%', 'Color uniform deep red', 'Zero pest cuts', 'Grade weight: 80-100g each']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Mandi)',
        description: 'Commercial fresh quality, minor skin variations allowed',
        criteria: ['Firmness > 85%', 'Slight green shoulder allowed', 'Good for regional transport']
      },
      {
        code: 'C',
        name: 'Grade C (Processing / Sauce)',
        description: 'Soft or irregular shape, suitable for puree / sauce factories',
        criteria: ['Ripe, non-punctured', 'High brix sugar content', 'Ideal for industrial canning']
      }
    ]
  },
  {
    id: 'crop-onion',
    nameKey: 'Onion',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🧅',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Garwa / Nashik Special)',
        description: 'Double cured skin, 55mm+ size, dry neck, zero sprouting',
        criteria: ['Size 55-65mm', 'Moisture < 12%', 'No double bulbs']
      },
      {
        code: 'B',
        name: 'Grade B (Medium Table Grade)',
        description: 'Clean red onion, 40-50mm, fresh market intake',
        criteria: ['Size 40-50mm', 'Firm texture']
      },
      {
        code: 'C',
        name: 'Grade C (Golta / Small)',
        description: 'Small size 25-35mm for sambar / pickling',
        criteria: ['Uniform mini bulbs']
      }
    ]
  },
  {
    id: 'crop-chilli',
    nameKey: 'Green Chilli',
    category: 'Spices & Condiments',
    unit: 'kg',
    icon: '🌶️',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Guntur Teja / Fresh Export)',
        description: 'Dark green, stiff stem, 7-10cm length, high pungency',
        criteria: ['Stem intact', 'Zero yellowing', 'High capsaicin']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Market)',
        description: 'Fresh crisp chillies for local vegetable markets',
        criteria: ['Length 5-7cm', 'Firm texture']
      },
      {
        code: 'C',
        name: 'Grade C (Pickle Grade)',
        description: 'Mature chillies suitable for processing',
        criteria: ['Clean condition']
      }
    ]
  },
  {
    id: 'crop-potato',
    nameKey: 'Potato',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🥔',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Chipsona / Table Top)',
        description: 'Clean smooth skin, 50mm+ oval, zero greening',
        criteria: ['Low sugar', 'Zero hollow heart']
      },
      {
        code: 'B',
        name: 'Grade B (Jyoti Standard)',
        description: 'Standard domestic cooking potato',
        criteria: ['40-50mm diameter']
      },
      {
        code: 'C',
        name: 'Grade C (Small Curry Grade)',
        description: 'Small tubers for baby potato dishes',
        criteria: ['Clean surface']
      }
    ]
  },
  {
    id: 'crop-cotton',
    nameKey: 'Raw Cotton (Kapas)',
    category: 'Fiber Crops',
    unit: 'quintal',
    icon: '☁️',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Shankar-6 Long Staple)',
        description: '29mm+ staple length, trash < 3%, moisture < 8%',
        criteria: ['Clean white lint', 'High ginning outturn']
      },
      {
        code: 'B',
        name: 'Grade B (Medium Staple 26-28mm)',
        description: 'Standard mill requirement',
        criteria: ['Moisture < 9%']
      },
      {
        code: 'C',
        name: 'Grade C (Yellow Stained / Rain Hit)',
        description: 'Discolored lint for coarse yarn spinning',
        criteria: ['Usable fiber']
      }
    ]
  },
  {
    id: 'crop-rice',
    nameKey: 'Paddy Rice',
    category: 'Cereals',
    unit: 'quintal',
    icon: '🌾',
    grades: [
      {
        code: 'A',
        name: 'Grade A (BPT 5204 Sona Masoori)',
        description: 'Fine slender grain, moisture < 14%, head rice recovery > 65%',
        criteria: ['Slender grain', 'Zero discoloration']
      },
      {
        code: 'B',
        name: 'Grade B (Swarna Common Paddy)',
        description: 'Medium bold grain for parboiled milling',
        criteria: ['Standard grain length']
      },
      {
        code: 'C',
        name: 'Grade C (Coarse Grade)',
        description: 'Commercial intake',
        criteria: ['Sound grain']
      }
    ]
  },
  {
    id: 'crop-wheat',
    nameKey: 'Wheat (Gehun)',
    category: 'Cereals',
    unit: 'quintal',
    icon: '🌾',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Sharbati Golden Grain)',
        description: 'Lustrous bold amber grains, moisture < 12%',
        criteria: ['Bold grain', 'High gluten']
      },
      {
        code: 'B',
        name: 'Grade B (Lokwan / Mill Quality)',
        description: 'Standard wheat for commercial flour milling',
        criteria: ['Sound grains', 'Clean']
      },
      {
        code: 'C',
        name: 'Grade C (Feed / Coarse Grade)',
        description: 'Wholesale standard intake',
        criteria: ['Usable quality']
      }
    ]
  },
  {
    id: 'crop-maize',
    nameKey: 'Maize (Corn)',
    category: 'Cereals',
    unit: 'quintal',
    icon: '🌽',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Yellow Bold / Starch Quality)',
        description: 'Bright golden yellow, moisture < 13%, aflatoxin free',
        criteria: ['Moisture < 13%', 'Clean grain']
      },
      {
        code: 'B',
        name: 'Grade B (Poultry Feed Standard)',
        description: 'Uniform dried kernels for feed mills',
        criteria: ['Sound kernels']
      },
      {
        code: 'C',
        name: 'Grade C (Industrial Distiller Grade)',
        description: 'Bulk commercial supply',
        criteria: ['Dried properly']
      }
    ]
  },
  {
    id: 'crop-soybean',
    nameKey: 'Soybean',
    category: 'Oilseeds',
    unit: 'quintal',
    icon: '🫘',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Yellow Bold / High Oil > 19%)',
        description: 'Clean spherical seeds, moisture < 10%',
        criteria: ['Oil content > 19%', 'Zero black seeds']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Commercial)',
        description: 'Mandi grade for solvent extraction plants',
        criteria: ['Moisture < 12%']
      },
      {
        code: 'C',
        name: 'Grade C (Processing Crude Grade)',
        description: 'Mixed moisture lots',
        criteria: ['Sound seed']
      }
    ]
  },
  {
    id: 'crop-turmeric',
    nameKey: 'Turmeric (Haldi)',
    category: 'Spices',
    unit: 'quintal',
    icon: '🟡',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Salem / Nizamabad Finger)',
        description: 'Long polished fingers, Curcumin > 3.5%, dry sound texture',
        criteria: ['Curcumin > 3.5%', 'Polished finger']
      },
      {
        code: 'B',
        name: 'Grade B (Bulb / Gatha Quality)',
        description: 'Round bulbs, rich natural color for grinding',
        criteria: ['Dry core']
      },
      {
        code: 'C',
        name: 'Grade C (Commercial Choor)',
        description: 'Pieces and split roots for oleoresin extraction',
        criteria: ['Free of mould']
      }
    ]
  },
  {
    id: 'crop-garlic',
    nameKey: 'Garlic (Lahsun)',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🧄',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Ooty Extra Bold 45mm+)',
        description: 'Tight white skin, 10-14 bold cloves, zero hollow heart',
        criteria: ['Diameter > 45mm', 'Dry skin']
      },
      {
        code: 'B',
        name: 'Grade B (Medium Table Grade 35-40mm)',
        description: 'Crisp pungent cloves for kitchen wholesale',
        criteria: ['Sound cloves']
      },
      {
        code: 'C',
        name: 'Grade C (Small Goli / Paste Grade)',
        description: 'Mini bulbs for ginger-garlic paste industry',
        criteria: ['Clean bulb']
      }
    ]
  },
  {
    id: 'crop-ginger',
    nameKey: 'Ginger (Adrak)',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🫚',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Bold Fresh Washed Rhizome)',
        description: 'Plump fingers, fibrous juicy core, low soil residue',
        criteria: ['Plump rhizome', 'Clean']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Market Rhizome)',
        description: 'Fresh local mandi ginger',
        criteria: ['Sound skin']
      },
      {
        code: 'C',
        name: 'Grade C (Dry / Extraction Grade)',
        description: 'Processing and powder grade',
        criteria: ['Firm structure']
      }
    ]
  },
  {
    id: 'crop-groundnut',
    nameKey: 'Groundnut (Peanut)',
    category: 'Oilseeds',
    unit: 'quintal',
    icon: '🥜',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Bold TJ / 50-60 Count)',
        description: 'Dual kernel pods, pink clean seed, moisture < 7%',
        criteria: ['Oil > 48%', 'Zero aflatoxin']
      },
      {
        code: 'B',
        name: 'Grade B (Java Commercial Grade)',
        description: 'Medium pods for oil expelling units',
        criteria: ['Sound shell']
      },
      {
        code: 'C',
        name: 'Grade C (Crushing Pods)',
        description: 'Commercial intake',
        criteria: ['Usable oilseed']
      }
    ]
  },
  {
    id: 'crop-banana',
    nameKey: 'Banana (Kela)',
    category: 'Fruits',
    unit: 'kg',
    icon: '🍌',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Grand Naine Export 7-8 Inch)',
        description: 'Flawless green-yellow hands, 18-20cm fingers, zero bruising',
        criteria: ['Length > 18cm', 'Zero scuffs']
      },
      {
        code: 'B',
        name: 'Grade B (Domestic Table Fresh)',
        description: 'Uniform healthy bunches for urban retail',
        criteria: ['Sweet taste', 'Firm flesh']
      },
      {
        code: 'C',
        name: 'Grade C (Chips & Pulp Processing)',
        description: 'Firm raw or ripe bananas for snack factories',
        criteria: ['Free of cuts']
      }
    ]
  },
  {
    id: 'crop-mango',
    nameKey: 'Mango',
    category: 'Fruits',
    unit: 'kg',
    icon: '🥭',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Alphonso / Banganapalle 250g+)',
        description: 'Vibrant golden sheen, brix > 18, zero fruit fly spots',
        criteria: ['Weight > 250g', 'Export certified']
      },
      {
        code: 'B',
        name: 'Grade B (Table Fresh Grade)',
        description: 'Crisp aroma and sweet pulp for regional consumers',
        criteria: ['Weight 200-240g']
      },
      {
        code: 'C',
        name: 'Grade C (Juice & Canning Grade)',
        description: 'High pulp yield for nectar processing plants',
        criteria: ['Rich pulp content']
      }
    ]
  },
  {
    id: 'crop-cabbage',
    nameKey: 'Cabbage (Patta Gobhi)',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🥬',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Export Solid Head 1.2-1.5kg)',
        description: 'Tightly packed, crisp green outer leaves, zero black rot',
        criteria: ['Weight 1.2-1.5kg', 'Compact head', 'Zero worm holes']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Market Head)',
        description: 'Fresh sound cabbage for wholesale retail distribution',
        criteria: ['Firm head', 'Clean base cut']
      },
      {
        code: 'C',
        name: 'Grade C (Processing / Shredder Grade)',
        description: 'Loose leaves trimmed, suitable for hotel and dehydrated food industry',
        criteria: ['Clean leaves']
      }
    ]
  },
  {
    id: 'crop-cauliflower',
    nameKey: 'Cauliflower (Phool Gobhi)',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🥦',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Snow White Snowball Curd)',
        description: 'Dense ivory-white curds, wrapper leaves crisp and fresh, zero browning',
        criteria: ['Curd diameter > 15cm', 'Pure white curd', 'Zero riciness']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Domestic Curd)',
        description: 'Uniform curds for city retail mandis',
        criteria: ['Firm curd', 'Slight creamy hue allowed']
      },
      {
        code: 'C',
        name: 'Grade C (Curry & Pickling Grade)',
        description: 'Open floret clusters, ideal for restaurant curries and mixed pickle',
        criteria: ['Free of pests']
      }
    ]
  },
  {
    id: 'crop-brinjal',
    nameKey: 'Brinjal / Eggplant (Baingan)',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🍆',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Glossy Deep Purple / Kalpataru)',
        description: 'Mirror-shine skin, green fresh calyx, tender seedless core',
        criteria: ['Glossy sheen', 'Zero borer holes', 'Fresh green crown']
      },
      {
        code: 'B',
        name: 'Grade B (Round Bharta Quality)',
        description: 'Medium to large round eggplants for roasting and daily wholesale',
        criteria: ['Sound skin', 'Firm flesh']
      },
      {
        code: 'C',
        name: 'Grade C (Commercial Cooking)',
        description: 'Small or irregular shape brinjals for bulk sambar and curries',
        criteria: ['Clean cut']
      }
    ]
  },
  {
    id: 'crop-capsicum',
    nameKey: 'Capsicum / Bell Pepper (Shimla Mirch)',
    category: 'Vegetables',
    unit: 'kg',
    icon: '🫑',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Green 4-Lobe Blocky 150g+)',
        description: 'Thick crunchy walls, uniform deep dark green, export polyhouse grade',
        criteria: ['Weight > 150g', '4-lobed square shape', 'Zero sunscald']
      },
      {
        code: 'B',
        name: 'Grade B (Field Grown 3-Lobe)',
        description: 'Crisp vibrant green peppers for supermarket chains',
        criteria: ['Weight 100-140g', 'Firm walls']
      },
      {
        code: 'C',
        name: 'Grade C (Hotel / Dicing Grade)',
        description: 'Slightly curved peppers for fast-food, pizza, and noodle prep',
        criteria: ['Crisp flesh']
      }
    ]
  },
  {
    id: 'crop-apple',
    nameKey: 'Apple (Seb)',
    category: 'Fruits',
    unit: 'kg',
    icon: '🍎',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Kinnaur / Royal Delicious Export)',
        description: 'Crimson red wash > 80%, crisp aromatic white flesh, 75-80mm dia',
        criteria: ['Diameter 75-80mm', 'Brix > 14', 'Zero hail marks']
      },
      {
        code: 'B',
        name: 'Grade B (Medium Table Grade)',
        description: 'Good red blush, standard domestic retail packing',
        criteria: ['Diameter 65-72mm', 'Firm crunch']
      },
      {
        code: 'C',
        name: 'Grade C (Juice & Cider Grade)',
        description: 'Minor skin freckles, high sugar yield for pulp and cider plants',
        criteria: ['Sweet juice yield']
      }
    ]
  },
  {
    id: 'crop-pomegranate',
    nameKey: 'Pomegranate (Anar)',
    category: 'Fruits',
    unit: 'kg',
    icon: '🔴',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Bhagwa Super Export 300g+)',
        description: 'Ruby red arils, glossy dark pink peel, soft seeds, brix > 16',
        criteria: ['Weight > 300g', 'Zero thrips marks', 'Deep ruby arils']
      },
      {
        code: 'B',
        name: 'Grade B (Domestic Table Fresh 200-250g)',
        description: 'Sweet juicy arils for premium retail fruit markets',
        criteria: ['Weight 200-250g', 'Rich red juice']
      },
      {
        code: 'C',
        name: 'Grade C (Anardana & Juice Grade)',
        description: 'Peel scuffs allowed, high seed volume for juice and dried anardana',
        criteria: ['Juicy arils']
      }
    ]
  },
  {
    id: 'crop-papaya',
    nameKey: 'Papaya (Papita)',
    category: 'Fruits',
    unit: 'kg',
    icon: '🍈',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Red Lady 786 / 1.5-2kg)',
        description: 'Salmon-red thick sweet flesh, brix > 13, smooth green-yellow skin',
        criteria: ['Weight 1.5-2.0kg', 'Zero latex stains', 'Firm skin']
      },
      {
        code: 'B',
        name: 'Grade B (Table Ripe)',
        description: 'Sweet orange flesh for domestic city fruit stores',
        criteria: ['Firm structure', 'Clean blossom end']
      },
      {
        code: 'C',
        name: 'Grade C (Raw Green Tutti-Frutti Grade)',
        description: 'Green unripe papayas for candied tutti-frutti & enzyme extraction',
        criteria: ['Solid green raw']
      }
    ]
  },
  {
    id: 'crop-watermelon',
    nameKey: 'Watermelon (Tarbooz)',
    category: 'Fruits',
    unit: 'kg',
    icon: '🍉',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Namdhari Black / Sugar Baby 4-6kg)',
        description: 'Deep crimson crisp flesh, tiny seeds, brix > 12, hollow sound upon tap',
        criteria: ['Weight 4-6kg', 'Brix > 12', 'Zero internal hollow cracks']
      },
      {
        code: 'B',
        name: 'Grade B (Striped Kiran Variety)',
        description: 'Juicy sweet melon for highway fruit stalls and local vendors',
        criteria: ['Weight 3-5kg', 'Crisp rind']
      },
      {
        code: 'C',
        name: 'Grade C (Bulk Truckload Commercial)',
        description: 'Large melons for city juice bars and slice cutting kiosks',
        criteria: ['Sound rind']
      }
    ]
  },
  {
    id: 'crop-coconut',
    nameKey: 'Tender & Dry Coconut (Nariyal)',
    category: 'Horticulture',
    unit: 'kg',
    icon: '🥥',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Tender Royal 400ml+ Water / Export Copra)',
        description: 'Large green nut, sweet refreshing water, soft malai or thick copra',
        criteria: ['Water volume > 350ml', 'Sound outer husk', 'Zero leakage']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Mandi Husked Nut)',
        description: 'Dried husked coconuts for puja, temple, and oil extraction',
        criteria: ['Thick meat', 'Dry sound shell']
      },
      {
        code: 'C',
        name: 'Grade C (Copra Crushing / Coir Grade)',
        description: 'Nut lots for industrial copra oil expelling and fiber mills',
        criteria: ['Usable kernel']
      }
    ]
  },
  {
    id: 'crop-sugarcane',
    nameKey: 'Sugarcane (Ganna)',
    category: 'Cash Crops',
    unit: 'quintal',
    icon: '🎋',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Co-0238 High Sugar Recovery > 11%)',
        description: 'Long thick solid canes, high sucrose juice yield, zero red rot',
        criteria: ['Brix > 20', 'Zero red rot', 'Clean stripped internodes']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Mill Gate Cane)',
        description: 'Fresh harvest canes for sugar mill delivery within 24 hours',
        criteria: ['Fresh green juice', 'Sound stalk']
      },
      {
        code: 'C',
        name: 'Grade C (Jaggery / Gur Khandsari Grade)',
        description: 'Locally crushed cane for organic country jaggery furnaces',
        criteria: ['Sweet taste']
      }
    ]
  },
  {
    id: 'crop-mustard',
    nameKey: 'Mustard Seed (Sarson)',
    category: 'Oilseeds',
    unit: 'quintal',
    icon: '🌾',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Bold Black / Oil > 42%)',
        description: 'High oil yield, shiny uniform black seeds, moisture < 8%',
        criteria: ['Oil content > 42%', 'Moisture < 8%', 'Trash < 1%']
      },
      {
        code: 'B',
        name: 'Grade B (Yellow Pili Sarson Mandi)',
        description: 'Clean golden seeds for premium kachi ghani cold pressed oil',
        criteria: ['Oil > 38%', 'Dry sound seeds']
      },
      {
        code: 'C',
        name: 'Grade C (Commercial Expeller Grade)',
        description: 'Mixed moisture lots for solvent and mill expellers',
        criteria: ['Clean lot']
      }
    ]
  },
  {
    id: 'crop-redchilli',
    nameKey: 'Dry Red Chilli (Lal Mirch)',
    category: 'Spices',
    unit: 'kg',
    icon: '🌶️',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Byadgi / Guntur Sannam Stemless)',
        description: 'Deep glossy ruby red, high ASTA color > 140, moisture < 10%',
        criteria: ['ASTA Color > 140', 'Moisture < 10%', 'Zero fungus pod']
      },
      {
        code: 'B',
        name: 'Grade B (Standard Guntur Teja Stemmed)',
        description: 'Pungent whole chillies for spice grinding brands and mandis',
        criteria: ['High capsaicin', 'Crisp dry pod']
      },
      {
        code: 'C',
        name: 'Grade C (Fatki / Broken Pod Grade)',
        description: 'Pieces and split pods for oleoresin extraction and bulk curry powder',
        criteria: ['Dry clean pods']
      }
    ]
  },
  {
    id: 'crop-cardamom',
    nameKey: 'Small Green Cardamom (Elaichi)',
    category: 'Spices',
    unit: 'kg',
    icon: '🌿',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Idukki Bold 8mm+ Extra Green)',
        description: 'Vibrant emerald green pods, 8mm+ diameter, aromatic black seeds',
        criteria: ['Size 8mm+', 'Color bright deep green', 'Moisture < 10%']
      },
      {
        code: 'B',
        name: 'Grade B (Alleppey Green 7-7.5mm)',
        description: 'Fragrant sound cardamom pods for national wholesale',
        criteria: ['Size 7-7.5mm', 'Full seeds']
      },
      {
        code: 'C',
        name: 'Grade C (Open Pod / Pale Khushboo Grade)',
        description: 'Split or pale green pods for bakery, sweets, and garam masala',
        criteria: ['Aromatic seed core']
      }
    ]
  },
  {
    id: 'crop-coriander',
    nameKey: 'Coriander Seeds (Dhania)',
    category: 'Spices',
    unit: 'quintal',
    icon: '🌿',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Ramganj Mandi Eagle Green Bold)',
        description: 'Whole split-free spherical seeds, olive-green color, linalool oil > 0.8%',
        criteria: ['Volatile oil > 0.8%', 'Zero hollow husk', 'Clean aroma']
      },
      {
        code: 'B',
        name: 'Grade B (Scooter Standard Dhania)',
        description: 'Uniform golden-green seed lots for consumer spice packaging',
        criteria: ['Sound seeds', 'Dry texture']
      },
      {
        code: 'C',
        name: 'Grade C (Dalda / Broken Grade)',
        description: 'Split seeds and halves for commercial ground curry powder',
        criteria: ['Usable aroma']
      }
    ]
  },
  {
    id: 'crop-chana',
    nameKey: 'Chickpeas / Bengal Gram (Chana)',
    category: 'Pulses',
    unit: 'quintal',
    icon: '🫘',
    grades: [
      {
        code: 'A',
        name: 'Grade A (Dollar Kabuli Bold 42-44 Count)',
        description: 'Extra-large cream-white chickpeas, uniform size, moisture < 9%',
        criteria: ['Count 42-44 per oz', 'Zero weevil holes', 'Bright cream color']
      },
      {
        code: 'B',
        name: 'Grade B (Desi Chana Mandi Grade)',
        description: 'Brown wrinkled protein-rich seeds for besan flour milling',
        criteria: ['Moisture < 10%', 'Clean grains']
      },
      {
        code: 'C',
        name: 'Grade C (Dal Splitting Grade)',
        description: 'Smaller seeds suitable for chana dal processing and roasting',
        criteria: ['Dry sound pulse']
      }
    ]
  }
];

export const SAMPLE_LOCATIONS: LocationInfo[] = [
  { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Tirupati', area: 'Renigunta Market Yard', distanceKm: 42 },
  { country: 'India', state: 'Andhra Pradesh', district: 'Nellore', area: 'Kavali APMC Yard', distanceKm: 145 },
  { country: 'India', state: 'Telangana', district: 'Hyderabad', area: 'Bowenpally Agricultural Yard', distanceKm: 520 },
  { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', area: 'Yeshwanthpur APMC Yard', distanceKm: 165 },
  { country: 'India', state: 'Maharashtra', district: 'Mumbai Suburban', area: 'Vashi Turbhe APMC', distanceKm: 980 },
  { country: 'India', state: 'Delhi', district: 'North Delhi', area: 'Azadpur Fruits & Veg Mandi', distanceKm: 2150 }
];

export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  {
    id: 'mp-chittoor-tomato',
    marketName: 'Chittoor APMC Market',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Chittoor Town', distanceKm: 18 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    currentPricePerKg: 22,
    yesterdayPricePerKg: 21,
    minPricePerKg: 19,
    maxPricePerKg: 23,
    sevenDayTrend: [19, 20, 20, 21, 21, 21, 22],
    updatedAt: Date.now() - 1000 * 60 * 25, // 25 mins ago
    isVerified: true,
    source: 'APMC Daily Auction Sheet'
  },
  {
    id: 'mp-tirupati-tomato',
    marketName: 'Tirupati Agricultural Mandi',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Tirupati', area: 'Renigunta Road', distanceKm: 42 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    currentPricePerKg: 24,
    yesterdayPricePerKg: 23,
    minPricePerKg: 21,
    maxPricePerKg: 25,
    sevenDayTrend: [21, 22, 22, 23, 23, 24, 24],
    updatedAt: Date.now() - 1000 * 60 * 45, // 45 mins ago
    isVerified: true,
    source: 'APMC Bulletin'
  },
  {
    id: 'mp-nellore-tomato',
    marketName: 'Nellore Wholesale Mandi',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Nellore', area: 'Kavali Highway Yard', distanceKm: 145 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    currentPricePerKg: 23,
    yesterdayPricePerKg: 22,
    minPricePerKg: 20,
    maxPricePerKg: 24,
    sevenDayTrend: [20, 21, 21, 22, 22, 23, 23],
    updatedAt: Date.now() - 1000 * 60 * 110, // ~2 hours ago
    isVerified: true,
    source: 'District Market Committee'
  },
  {
    id: 'mp-hyderabad-tomato',
    marketName: 'Hyderabad Bowenpally Yard',
    location: { country: 'India', state: 'Telangana', district: 'Hyderabad', area: 'Bowenpally Terminal', distanceKm: 520 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    currentPricePerKg: 26,
    yesterdayPricePerKg: 25,
    minPricePerKg: 23,
    maxPricePerKg: 28,
    sevenDayTrend: [23, 24, 24, 25, 25, 26, 26],
    updatedAt: Date.now() - 1000 * 60 * 15, // 15 mins ago
    isVerified: true,
    source: 'TS Agricultural Marketing Dept'
  },
  {
    id: 'mp-bengaluru-tomato',
    marketName: 'Bengaluru Yeshwanthpur Mandi',
    location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', area: 'APMC Yard Yard-B', distanceKm: 165 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    currentPricePerKg: 28,
    yesterdayPricePerKg: 27,
    minPricePerKg: 25,
    maxPricePerKg: 30,
    sevenDayTrend: [24, 25, 26, 26, 27, 27, 28],
    updatedAt: Date.now() - 1000 * 60 * 10, // 10 mins ago
    isVerified: true,
    source: 'Karnataka State APMC'
  },
  {
    id: 'mp-mumbai-tomato',
    marketName: 'Vashi Navi Mumbai APMC',
    location: { country: 'India', state: 'Maharashtra', district: 'Thane / Navi Mumbai', area: 'Turbhe Market-1', distanceKm: 980 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    currentPricePerKg: 31,
    yesterdayPricePerKg: 30,
    minPricePerKg: 27,
    maxPricePerKg: 33,
    sevenDayTrend: [26, 27, 28, 29, 30, 30, 31],
    updatedAt: Date.now() - 1000 * 60 * 35,
    isVerified: true,
    source: 'MSAMB Agri Portal'
  },
  {
    id: 'mp-delhi-tomato',
    marketName: 'Azadpur Subzi Mandi',
    location: { country: 'India', state: 'Delhi', district: 'North Delhi', area: 'Azadpur Terminal', distanceKm: 2150 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    currentPricePerKg: 34,
    yesterdayPricePerKg: 33,
    minPricePerKg: 30,
    maxPricePerKg: 36,
    sevenDayTrend: [28, 30, 31, 32, 33, 33, 34],
    updatedAt: Date.now() - 1000 * 60 * 50,
    isVerified: true,
    source: 'APMC Azadpur Trade Board'
  },
  // Onions
  {
    id: 'mp-nashik-onion',
    marketName: 'Lasalgaon / Nashik Mandi',
    location: { country: 'India', state: 'Maharashtra', district: 'Nashik', area: 'Lasalgaon APMC', distanceKm: 890 },
    cropId: 'crop-onion',
    cropName: 'Onion',
    grade: 'A',
    currentPricePerKg: 29,
    yesterdayPricePerKg: 28,
    minPricePerKg: 25,
    maxPricePerKg: 31,
    sevenDayTrend: [24, 25, 26, 27, 28, 28, 29],
    updatedAt: Date.now() - 1000 * 60 * 20,
    isVerified: true,
    source: 'Lasalgaon Onion Association'
  },
  {
    id: 'mp-hyderabad-onion',
    marketName: 'Hyderabad Malakpet Yard',
    location: { country: 'India', state: 'Telangana', district: 'Hyderabad', area: 'Malakpet Onion Yard', distanceKm: 525 },
    cropId: 'crop-onion',
    cropName: 'Onion',
    grade: 'A',
    currentPricePerKg: 33,
    yesterdayPricePerKg: 32,
    minPricePerKg: 30,
    maxPricePerKg: 35,
    sevenDayTrend: [28, 29, 30, 31, 32, 32, 33],
    updatedAt: Date.now() - 1000 * 60 * 30,
    isVerified: true,
    source: 'TS Marketing Board'
  },
  // Green Chilli
  {
    id: 'mp-guntur-chilli',
    marketName: 'Guntur Mirchi Yard',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Guntur', area: 'Guntur Spices Yard', distanceKm: 340 },
    cropId: 'crop-chilli',
    cropName: 'Green Chilli',
    grade: 'A',
    currentPricePerKg: 48,
    yesterdayPricePerKg: 46,
    minPricePerKg: 42,
    maxPricePerKg: 52,
    sevenDayTrend: [40, 42, 44, 45, 46, 46, 48],
    updatedAt: Date.now() - 1000 * 60 * 18,
    isVerified: true,
    source: 'Guntur Market Committee'
  },
  {
    id: 'mp-nashik-onion',
    marketName: 'Lasalgaon Mandi (Nashik)',
    location: { country: 'India', state: 'Maharashtra', district: 'Nashik', area: 'Lasalgaon Yard', distanceKm: 850 },
    cropId: 'crop-onion',
    cropName: 'Onion',
    grade: 'A',
    currentPricePerKg: 32,
    yesterdayPricePerKg: 30,
    minPricePerKg: 28,
    maxPricePerKg: 34,
    sevenDayTrend: [28, 29, 30, 31, 30, 31, 32],
    updatedAt: Date.now() - 1000 * 60 * 20,
    isVerified: true,
    source: 'Maharashtra State APMC'
  },
  {
    id: 'mp-agra-potato',
    marketName: 'Agra Wholesale Mandi',
    location: { country: 'India', state: 'Uttar Pradesh', district: 'Agra', area: 'Sikandra Terminal', distanceKm: 1800 },
    cropId: 'crop-potato',
    cropName: 'Potato',
    grade: 'A',
    currentPricePerKg: 19,
    yesterdayPricePerKg: 18,
    minPricePerKg: 16,
    maxPricePerKg: 20,
    sevenDayTrend: [17, 17, 18, 18, 19, 19, 19],
    updatedAt: Date.now() - 1000 * 60 * 40,
    isVerified: true,
    source: 'UP Mandi Parishad'
  },
  {
    id: 'mp-rajkot-cotton',
    marketName: 'Rajkot Cotton Yard',
    location: { country: 'India', state: 'Gujarat', district: 'Rajkot', area: 'Bedi APMC Yard', distanceKm: 1400 },
    cropId: 'crop-cotton',
    cropName: 'Raw Cotton (Kapas)',
    grade: 'A',
    currentPricePerKg: 74,
    yesterdayPricePerKg: 73,
    minPricePerKg: 70,
    maxPricePerKg: 76,
    sevenDayTrend: [70, 71, 72, 73, 73, 74, 74],
    updatedAt: Date.now() - 1000 * 60 * 15,
    isVerified: true,
    source: 'Cotton Association of India'
  },
  {
    id: 'mp-karnal-rice',
    marketName: 'Karnal Grain Market',
    location: { country: 'India', state: 'Haryana', district: 'Karnal', area: 'New Grain Market', distanceKm: 2100 },
    cropId: 'crop-rice',
    cropName: 'Paddy Rice',
    grade: 'A',
    currentPricePerKg: 27,
    yesterdayPricePerKg: 26,
    minPricePerKg: 25,
    maxPricePerKg: 28,
    sevenDayTrend: [25, 25, 26, 26, 26, 27, 27],
    updatedAt: Date.now() - 1000 * 60 * 30,
    isVerified: true,
    source: 'Haryana Agri Marketing Board'
  },
  {
    id: 'mp-indore-wheat',
    marketName: 'Indore Laxmibainagar Mandi',
    location: { country: 'India', state: 'Madhya Pradesh', district: 'Indore', area: 'Laxmibainagar Yard', distanceKm: 1100 },
    cropId: 'crop-wheat',
    cropName: 'Wheat (Gehun)',
    grade: 'A',
    currentPricePerKg: 29,
    yesterdayPricePerKg: 28,
    minPricePerKg: 27,
    maxPricePerKg: 30,
    sevenDayTrend: [27, 27, 28, 28, 28, 29, 29],
    updatedAt: Date.now() - 1000 * 60 * 22,
    isVerified: true,
    source: 'MP Mandi Board'
  },
  {
    id: 'mp-davanagere-maize',
    marketName: 'Davanagere APMC Market',
    location: { country: 'India', state: 'Karnataka', district: 'Davanagere', area: 'APMC Yard', distanceKm: 340 },
    cropId: 'crop-maize',
    cropName: 'Maize (Corn)',
    grade: 'A',
    currentPricePerKg: 25,
    yesterdayPricePerKg: 24,
    minPricePerKg: 23,
    maxPricePerKg: 26,
    sevenDayTrend: [23, 23, 24, 24, 24, 25, 25],
    updatedAt: Date.now() - 1000 * 60 * 35,
    isVerified: true,
    source: 'Karnataka State Agri Board'
  },
  {
    id: 'mp-ujjain-soybean',
    marketName: 'Ujjain APMC Mandi',
    location: { country: 'India', state: 'Madhya Pradesh', district: 'Ujjain', area: 'Chimanganj Mandi', distanceKm: 1150 },
    cropId: 'crop-soybean',
    cropName: 'Soybean',
    grade: 'A',
    currentPricePerKg: 52,
    yesterdayPricePerKg: 51,
    minPricePerKg: 49,
    maxPricePerKg: 54,
    sevenDayTrend: [49, 50, 50, 51, 51, 52, 52],
    updatedAt: Date.now() - 1000 * 60 * 18,
    isVerified: true,
    source: 'SOPA Soybean Processors Association'
  },
  {
    id: 'mp-nizamabad-turmeric',
    marketName: 'Nizamabad Turmeric Market Yard',
    location: { country: 'India', state: 'Telangana', district: 'Nizamabad', area: 'APMC Yard', distanceKm: 680 },
    cropId: 'crop-turmeric',
    cropName: 'Turmeric (Haldi)',
    grade: 'A',
    currentPricePerKg: 142,
    yesterdayPricePerKg: 138,
    minPricePerKg: 135,
    maxPricePerKg: 146,
    sevenDayTrend: [132, 134, 135, 136, 138, 140, 142],
    updatedAt: Date.now() - 1000 * 60 * 12,
    isVerified: true,
    source: 'Spices Board of India'
  },
  {
    id: 'mp-mandsaur-garlic',
    marketName: 'Mandsaur Garlic Mandi',
    location: { country: 'India', state: 'Madhya Pradesh', district: 'Mandsaur', area: 'Krishi Upaj Mandi', distanceKm: 1250 },
    cropId: 'crop-garlic',
    cropName: 'Garlic (Lahsun)',
    grade: 'A',
    currentPricePerKg: 155,
    yesterdayPricePerKg: 150,
    minPricePerKg: 145,
    maxPricePerKg: 160,
    sevenDayTrend: [142, 145, 148, 150, 150, 152, 155],
    updatedAt: Date.now() - 1000 * 60 * 25,
    isVerified: true,
    source: 'National Horticulture Board'
  },
  {
    id: 'mp-wayanad-ginger',
    marketName: 'Kochi & Wayanad Ginger Exchange',
    location: { country: 'India', state: 'Kerala', district: 'Wayanad', area: 'Sulthan Bathery Yard', distanceKm: 460 },
    cropId: 'crop-ginger',
    cropName: 'Ginger (Adrak)',
    grade: 'A',
    currentPricePerKg: 84,
    yesterdayPricePerKg: 82,
    minPricePerKg: 78,
    maxPricePerKg: 86,
    sevenDayTrend: [76, 78, 80, 80, 82, 82, 84],
    updatedAt: Date.now() - 1000 * 60 * 30,
    isVerified: true,
    source: 'Spices Board Kochi'
  },
  {
    id: 'mp-gondal-groundnut',
    marketName: 'Gondal APMC Yard',
    location: { country: 'India', state: 'Gujarat', district: 'Rajkot', area: 'Gondal Marketing Yard', distanceKm: 1380 },
    cropId: 'crop-groundnut',
    cropName: 'Groundnut (Peanut)',
    grade: 'A',
    currentPricePerKg: 72,
    yesterdayPricePerKg: 71,
    minPricePerKg: 68,
    maxPricePerKg: 75,
    sevenDayTrend: [68, 69, 70, 70, 71, 71, 72],
    updatedAt: Date.now() - 1000 * 60 * 40,
    isVerified: true,
    source: 'Gujarat State APMC'
  },
  {
    id: 'mp-jalgaon-banana',
    marketName: 'Jalgaon Banana Terminal',
    location: { country: 'India', state: 'Maharashtra', district: 'Jalgaon', area: 'Raver APMC Market', distanceKm: 780 },
    cropId: 'crop-banana',
    cropName: 'Banana (Kela)',
    grade: 'A',
    currentPricePerKg: 22,
    yesterdayPricePerKg: 21,
    minPricePerKg: 19,
    maxPricePerKg: 23,
    sevenDayTrend: [19, 20, 20, 21, 21, 21, 22],
    updatedAt: Date.now() - 1000 * 60 * 15,
    isVerified: true,
    source: 'Maha Banana Federation'
  },
  {
    id: 'mp-ratnagiri-mango',
    marketName: 'Vashi & Chittoor Mango Hub',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Damalcheruvu Yard', distanceKm: 32 },
    cropId: 'crop-mango',
    cropName: 'Mango',
    grade: 'A',
    currentPricePerKg: 95,
    yesterdayPricePerKg: 92,
    minPricePerKg: 88,
    maxPricePerKg: 98,
    sevenDayTrend: [85, 88, 90, 90, 92, 92, 95],
    updatedAt: Date.now() - 1000 * 60 * 10,
    isVerified: true,
    source: 'Horticulture Development Agency'
  },
  {
    id: 'mp-cabbage',
    marketName: 'Chittoor APMC Market',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Chittoor Town', distanceKm: 18 },
    cropId: 'crop-cabbage',
    cropName: 'Cabbage (Patta Gobhi)',
    grade: 'A',
    currentPricePerKg: 18,
    yesterdayPricePerKg: 17,
    minPricePerKg: 15,
    maxPricePerKg: 20,
    sevenDayTrend: [16, 16, 17, 17, 18, 18, 18],
    updatedAt: Date.now() - 1000 * 60 * 15,
    isVerified: true,
    source: 'APMC Daily Sheet'
  },
  {
    id: 'mp-cauliflower',
    marketName: 'Bengaluru Yeshwanthpur Mandi',
    location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', area: 'Yeshwanthpur', distanceKm: 165 },
    cropId: 'crop-cauliflower',
    cropName: 'Cauliflower (Phool Gobhi)',
    grade: 'A',
    currentPricePerKg: 24,
    yesterdayPricePerKg: 22,
    minPricePerKg: 20,
    maxPricePerKg: 26,
    sevenDayTrend: [20, 21, 22, 23, 23, 24, 24],
    updatedAt: Date.now() - 1000 * 60 * 20,
    isVerified: true,
    source: 'State APMC Portal'
  },
  {
    id: 'mp-brinjal',
    marketName: 'Tirupati Agricultural Mandi',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Tirupati', area: 'Renigunta', distanceKm: 42 },
    cropId: 'crop-brinjal',
    cropName: 'Brinjal / Eggplant (Baingan)',
    grade: 'A',
    currentPricePerKg: 22,
    yesterdayPricePerKg: 20,
    minPricePerKg: 18,
    maxPricePerKg: 25,
    sevenDayTrend: [19, 19, 20, 21, 21, 22, 22],
    updatedAt: Date.now() - 1000 * 60 * 25,
    isVerified: true,
    source: 'District Market Committee'
  },
  {
    id: 'mp-capsicum',
    marketName: 'Bengaluru Yeshwanthpur Mandi',
    location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', area: 'APMC Yard', distanceKm: 165 },
    cropId: 'crop-capsicum',
    cropName: 'Capsicum / Bell Pepper (Shimla Mirch)',
    grade: 'A',
    currentPricePerKg: 45,
    yesterdayPricePerKg: 42,
    minPricePerKg: 40,
    maxPricePerKg: 48,
    sevenDayTrend: [38, 40, 41, 42, 43, 44, 45],
    updatedAt: Date.now() - 1000 * 60 * 12,
    isVerified: true,
    source: 'State APMC Portal'
  },
  {
    id: 'mp-apple',
    marketName: 'Azadpur Fruits Mandi Delhi',
    location: { country: 'India', state: 'Delhi', district: 'North Delhi', area: 'Azadpur', distanceKm: 2150 },
    cropId: 'crop-apple',
    cropName: 'Apple (Seb)',
    grade: 'A',
    currentPricePerKg: 120,
    yesterdayPricePerKg: 115,
    minPricePerKg: 110,
    maxPricePerKg: 130,
    sevenDayTrend: [110, 112, 114, 116, 118, 120, 120],
    updatedAt: Date.now() - 1000 * 60 * 10,
    isVerified: true,
    source: 'National Horticulture Board'
  },
  {
    id: 'mp-pomegranate',
    marketName: 'Solapur & Hyderabad Mandi',
    location: { country: 'India', state: 'Maharashtra', district: 'Solapur', area: 'Solapur APMC', distanceKm: 420 },
    cropId: 'crop-pomegranate',
    cropName: 'Pomegranate (Anar)',
    grade: 'A',
    currentPricePerKg: 135,
    yesterdayPricePerKg: 130,
    minPricePerKg: 120,
    maxPricePerKg: 145,
    sevenDayTrend: [122, 125, 128, 130, 132, 134, 135],
    updatedAt: Date.now() - 1000 * 60 * 30,
    isVerified: true,
    source: 'National Horticulture Board'
  },
  {
    id: 'mp-papaya',
    marketName: 'Bowenpally Fruit Yard',
    location: { country: 'India', state: 'Telangana', district: 'Hyderabad', area: 'Bowenpally', distanceKm: 520 },
    cropId: 'crop-papaya',
    cropName: 'Papaya (Papita)',
    grade: 'A',
    currentPricePerKg: 20,
    yesterdayPricePerKg: 19,
    minPricePerKg: 17,
    maxPricePerKg: 22,
    sevenDayTrend: [18, 18, 19, 19, 20, 20, 20],
    updatedAt: Date.now() - 1000 * 60 * 20,
    isVerified: true,
    source: 'State Horticulture Bulletin'
  },
  {
    id: 'mp-watermelon',
    marketName: 'Chittoor Wholesale Yard',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Highway Yard', distanceKm: 18 },
    cropId: 'crop-watermelon',
    cropName: 'Watermelon (Tarbooz)',
    grade: 'A',
    currentPricePerKg: 14,
    yesterdayPricePerKg: 13,
    minPricePerKg: 12,
    maxPricePerKg: 16,
    sevenDayTrend: [12, 13, 13, 13, 14, 14, 14],
    updatedAt: Date.now() - 1000 * 60 * 40,
    isVerified: true,
    source: 'Local Mandi Committee'
  },
  {
    id: 'mp-coconut',
    marketName: 'Pollachi & Konaseema Coconut Yard',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'East Godavari', area: 'Konaseema', distanceKm: 480 },
    cropId: 'crop-coconut',
    cropName: 'Tender & Dry Coconut (Nariyal)',
    grade: 'A',
    currentPricePerKg: 32,
    yesterdayPricePerKg: 30,
    minPricePerKg: 28,
    maxPricePerKg: 35,
    sevenDayTrend: [28, 29, 30, 31, 31, 32, 32],
    updatedAt: Date.now() - 1000 * 60 * 15,
    isVerified: true,
    source: 'Coconut Development Board'
  },
  {
    id: 'mp-sugarcane',
    marketName: 'Chittoor Sugar Mill Gate',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Sugar Mill Gate', distanceKm: 22 },
    cropId: 'crop-sugarcane',
    cropName: 'Sugarcane (Ganna)',
    grade: 'A',
    currentPricePerKg: 38,
    yesterdayPricePerKg: 37,
    minPricePerKg: 35,
    maxPricePerKg: 40,
    sevenDayTrend: [35, 36, 36, 37, 37, 38, 38],
    updatedAt: Date.now() - 1000 * 60 * 50,
    isVerified: true,
    source: 'State Cane Commissioner FRP'
  },
  {
    id: 'mp-mustard',
    marketName: 'Bharatpur Mustard APMC',
    location: { country: 'India', state: 'Rajasthan', district: 'Bharatpur', area: 'APMC Mandi', distanceKm: 1800 },
    cropId: 'crop-mustard',
    cropName: 'Mustard Seed (Sarson)',
    grade: 'A',
    currentPricePerKg: 62,
    yesterdayPricePerKg: 60,
    minPricePerKg: 58,
    maxPricePerKg: 65,
    sevenDayTrend: [58, 59, 60, 60, 61, 62, 62],
    updatedAt: Date.now() - 1000 * 60 * 25,
    isVerified: true,
    source: 'SEA Oil World Daily'
  },
  {
    id: 'mp-redchilli',
    marketName: 'Guntur Asian Spice Mandi',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Guntur', area: 'Kallu Yard', distanceKm: 340 },
    cropId: 'crop-redchilli',
    cropName: 'Dry Red Chilli (Lal Mirch)',
    grade: 'A',
    currentPricePerKg: 210,
    yesterdayPricePerKg: 205,
    minPricePerKg: 195,
    maxPricePerKg: 225,
    sevenDayTrend: [198, 200, 202, 204, 206, 208, 210],
    updatedAt: Date.now() - 1000 * 60 * 10,
    isVerified: true,
    source: 'Spices Board of India'
  },
  {
    id: 'mp-cardamom',
    marketName: 'Spices Park Puttady Idukki',
    location: { country: 'India', state: 'Kerala', district: 'Idukki', area: 'Puttady Auction Yard', distanceKm: 620 },
    cropId: 'crop-cardamom',
    cropName: 'Small Green Cardamom (Elaichi)',
    grade: 'A',
    currentPricePerKg: 1850,
    yesterdayPricePerKg: 1820,
    minPricePerKg: 1750,
    maxPricePerKg: 1920,
    sevenDayTrend: [1780, 1800, 1810, 1820, 1835, 1840, 1850],
    updatedAt: Date.now() - 1000 * 60 * 18,
    isVerified: true,
    source: 'Spices Board E-Auction'
  },
  {
    id: 'mp-coriander',
    marketName: 'Ramganj Mandi Kota',
    location: { country: 'India', state: 'Rajasthan', district: 'Kota', area: 'Ramganj APMC', distanceKm: 1450 },
    cropId: 'crop-coriander',
    cropName: 'Coriander Seeds (Dhania)',
    grade: 'A',
    currentPricePerKg: 85,
    yesterdayPricePerKg: 82,
    minPricePerKg: 78,
    maxPricePerKg: 90,
    sevenDayTrend: [80, 81, 82, 83, 84, 85, 85],
    updatedAt: Date.now() - 1000 * 60 * 30,
    isVerified: true,
    source: 'Spices Board Bulletin'
  },
  {
    id: 'mp-chana',
    marketName: 'Akola & Bikaner Pulse Mandi',
    location: { country: 'India', state: 'Maharashtra', district: 'Akola', area: 'Grain Yard', distanceKm: 850 },
    cropId: 'crop-chana',
    cropName: 'Chickpeas / Bengal Gram (Chana)',
    grade: 'A',
    currentPricePerKg: 68,
    yesterdayPricePerKg: 66,
    minPricePerKg: 63,
    maxPricePerKg: 72,
    sevenDayTrend: [64, 65, 66, 66, 67, 67, 68],
    updatedAt: Date.now() - 1000 * 60 * 35,
    isVerified: true,
    source: 'National Pulse Federation'
  }
];

export const INITIAL_MARKET_REQUIREMENTS: MarketRequirement[] = [
  {
    id: 'req-hyd-tomato-1',
    buyerId: 'user-buyer-1',
    buyerName: 'Vikram Reddy',
    businessName: 'Sri Balaji Agro Fresh Pvt Ltd',
    isVerified: true,
    marketName: 'Hyderabad Bowenpally Yard',
    location: { country: 'India', state: 'Telangana', district: 'Hyderabad', area: 'Bowenpally Terminal', distanceKm: 520 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    buyingPricePerKg: 26,
    requiredQuantityKg: 5000,
    prebookedQuantityKg: 2000,
    remainingQuantityKg: 3000,
    minOrderQuantityKg: 200,
    maxOrderQuantityKg: 2500,
    additionalRequirements: 'Stiff crates preferred. Need firm red fruit for supermarket packing.',
    updatedAt: Date.now() - 1000 * 60 * 15
  },
  {
    id: 'req-blr-tomato-2',
    buyerId: 'user-buyer-2',
    buyerName: 'Anand Kumar',
    businessName: 'Southern Fresh Procurement Hub',
    isVerified: true,
    marketName: 'Bengaluru Yeshwanthpur Mandi',
    location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', area: 'Yeshwanthpur Yard-B', distanceKm: 165 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    buyingPricePerKg: 28,
    requiredQuantityKg: 4000,
    prebookedQuantityKg: 1200,
    remainingQuantityKg: 2800,
    minOrderQuantityKg: 300,
    maxOrderQuantityKg: 2000,
    additionalRequirements: 'Immediate cash settlement at weighbridge. Plastic crate transport preferred.',
    updatedAt: Date.now() - 1000 * 60 * 8
  },
  {
    id: 'req-tpt-tomato-3',
    buyerId: 'user-buyer-3',
    buyerName: 'Kishore Naidu',
    businessName: 'Rayalaseema Traders & Exports',
    isVerified: true,
    marketName: 'Tirupati Agricultural Mandi',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Tirupati', area: 'Renigunta Road', distanceKm: 42 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    buyingPricePerKg: 24,
    requiredQuantityKg: 3000,
    prebookedQuantityKg: 1000,
    remainingQuantityKg: 2000,
    minOrderQuantityKg: 100,
    maxOrderQuantityKg: 1500,
    additionalRequirements: 'Farmgate pickup possible if quantity >= 1,000 kg within Chittoor/Tirupati.',
    updatedAt: Date.now() - 1000 * 60 * 40
  },
  {
    id: 'req-cht-tomato-4',
    buyerId: 'user-buyer-4',
    buyerName: 'Venkat Rao',
    businessName: 'Chittoor Local Commission Yard',
    isVerified: false,
    marketName: 'Chittoor APMC Market',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Chittoor Town', distanceKm: 18 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    buyingPricePerKg: 22,
    requiredQuantityKg: 2500,
    prebookedQuantityKg: 500,
    remainingQuantityKg: 2000,
    minOrderQuantityKg: 50,
    maxOrderQuantityKg: 1000,
    additionalRequirements: 'Daily evening intake until 7:00 PM.',
    updatedAt: Date.now() - 1000 * 60 * 55
  },
  {
    id: 'req-mum-tomato-5',
    buyerId: 'user-buyer-5',
    buyerName: 'Sanjay Patil',
    businessName: 'Maharashtra Mega Food Supply',
    isVerified: true,
    marketName: 'Vashi Navi Mumbai APMC',
    location: { country: 'India', state: 'Maharashtra', district: 'Thane', area: 'Turbhe APMC', distanceKm: 980 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    buyingPricePerKg: 31,
    requiredQuantityKg: 10000,
    prebookedQuantityKg: 4000,
    remainingQuantityKg: 6000,
    minOrderQuantityKg: 1000,
    maxOrderQuantityKg: 5000,
    additionalRequirements: 'Reefer truck transport subsidy available for full container lots.',
    updatedAt: Date.now() - 1000 * 60 * 30
  },
  // Onion Requirement
  {
    id: 'req-hyd-onion-1',
    buyerId: 'user-buyer-1',
    buyerName: 'Vikram Reddy',
    businessName: 'Sri Balaji Agro Fresh Pvt Ltd',
    isVerified: true,
    marketName: 'Hyderabad Malakpet Yard',
    location: { country: 'India', state: 'Telangana', district: 'Hyderabad', area: 'Malakpet Onion Yard', distanceKm: 525 },
    cropId: 'crop-onion',
    cropName: 'Onion',
    grade: 'A',
    buyingPricePerKg: 33,
    requiredQuantityKg: 8000,
    prebookedQuantityKg: 3000,
    remainingQuantityKg: 5000,
    minOrderQuantityKg: 500,
    maxOrderQuantityKg: 3000,
    additionalRequirements: 'Jute gunny bag packing. 50 kg bags.',
    updatedAt: Date.now() - 1000 * 60 * 20
  }
];

export const INITIAL_FARMER_LISTINGS: CropListing[] = [
  {
    id: 'listing-farmer-1',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    totalQuantityKg: 1000,
    availableQuantityKg: 600,
    lockedPendingKg: 0,
    prebookedQuantityKg: 400,
    expectedPricePerKg: 24, // Farmer's expected benchmark price
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 15,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 120,
    updatedAt: Date.now() - 1000 * 60 * 120
  },
  {
    id: 'listing-farmer-2',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-chilli',
    cropName: 'Green Chilli',
    grade: 'A',
    totalQuantityKg: 250,
    availableQuantityKg: 250,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 46, // Farmer's expected benchmark price
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoDurationSeconds: 12,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 300,
    updatedAt: Date.now() - 1000 * 60 * 300
  },
  {
    id: 'listing-farmer-3',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-onion',
    cropName: 'Onion',
    grade: 'A',
    totalQuantityKg: 1200,
    availableQuantityKg: 1200,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 31,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 14,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 180,
    updatedAt: Date.now() - 1000 * 60 * 180
  },
  {
    id: 'listing-farmer-4',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-potato',
    cropName: 'Potato',
    grade: 'A',
    totalQuantityKg: 850,
    availableQuantityKg: 500,
    lockedPendingKg: 0,
    prebookedQuantityKg: 350,
    expectedPricePerKg: 18,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoDurationSeconds: 10,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 220,
    updatedAt: Date.now() - 1000 * 60 * 220
  },
  {
    id: 'listing-farmer-5',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-wheat',
    cropName: 'Wheat (Gehun)',
    grade: 'A',
    totalQuantityKg: 2000,
    availableQuantityKg: 2000,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 28,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 12,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 90,
    updatedAt: Date.now() - 1000 * 60 * 90
  },
  {
    id: 'listing-farmer-6',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-maize',
    cropName: 'Maize (Corn)',
    grade: 'A',
    totalQuantityKg: 3500,
    availableQuantityKg: 3500,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 24,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoDurationSeconds: 15,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 60,
    updatedAt: Date.now() - 1000 * 60 * 60
  },
  {
    id: 'listing-farmer-7',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-turmeric',
    cropName: 'Turmeric (Haldi)',
    grade: 'A',
    totalQuantityKg: 650,
    availableQuantityKg: 650,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 138,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 16,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 45,
    updatedAt: Date.now() - 1000 * 60 * 45
  },
  {
    id: 'listing-farmer-8',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-garlic',
    cropName: 'Garlic (Lahsun)',
    grade: 'A',
    totalQuantityKg: 400,
    availableQuantityKg: 400,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 150,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoDurationSeconds: 11,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 30,
    updatedAt: Date.now() - 1000 * 60 * 30
  },
  {
    id: 'listing-farmer-9',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-mango',
    cropName: 'Mango',
    grade: 'A',
    totalQuantityKg: 1000,
    availableQuantityKg: 1000,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 90,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 13,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 15,
    updatedAt: Date.now() - 1000 * 60 * 15
  },
  {
    id: 'listing-farmer-10',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-cabbage',
    cropName: 'Cabbage (Patta Gobhi)',
    grade: 'A',
    totalQuantityKg: 1200,
    availableQuantityKg: 1200,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 18,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoDurationSeconds: 12,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 40,
    updatedAt: Date.now() - 1000 * 60 * 40
  },
  {
    id: 'listing-farmer-11',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-cauliflower',
    cropName: 'Cauliflower (Phool Gobhi)',
    grade: 'A',
    totalQuantityKg: 800,
    availableQuantityKg: 800,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 24,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoDurationSeconds: 14,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 35,
    updatedAt: Date.now() - 1000 * 60 * 35
  },
  {
    id: 'listing-farmer-12',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-capsicum',
    cropName: 'Capsicum / Bell Pepper (Shimla Mirch)',
    grade: 'A',
    totalQuantityKg: 600,
    availableQuantityKg: 600,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 44,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 15,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 20,
    updatedAt: Date.now() - 1000 * 60 * 20
  },
  {
    id: 'listing-farmer-13',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-capsicum',
    cropName: 'Capsicum / Bell Pepper (Shimla Mirch)',
    grade: 'B',
    totalQuantityKg: 400,
    availableQuantityKg: 400,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 38,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoDurationSeconds: 10,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 18,
    updatedAt: Date.now() - 1000 * 60 * 18
  },
  {
    id: 'listing-farmer-14',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-brinjal',
    cropName: 'Brinjal / Eggplant (Baingan)',
    grade: 'A',
    totalQuantityKg: 750,
    availableQuantityKg: 750,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 21,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoDurationSeconds: 11,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 25,
    updatedAt: Date.now() - 1000 * 60 * 25
  },
  {
    id: 'listing-farmer-15',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-apple',
    cropName: 'Apple (Seb)',
    grade: 'A',
    totalQuantityKg: 1500,
    availableQuantityKg: 1500,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 118,
    location: { country: 'India', state: 'Himachal Pradesh', district: 'Shimla', area: 'Kotkhai Orchard', distanceKm: 2300 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 15,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 10,
    updatedAt: Date.now() - 1000 * 60 * 10
  },
  {
    id: 'listing-farmer-16',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-pomegranate',
    cropName: 'Pomegranate (Anar)',
    grade: 'A',
    totalQuantityKg: 900,
    availableQuantityKg: 0,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 130,
    location: { country: 'India', state: 'Maharashtra', district: 'Solapur', area: 'Sangola Mandi', distanceKm: 420 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoDurationSeconds: 12,
    status: 'SOLD_OUT',
    createdAt: Date.now() - 1000 * 60 * 15,
    updatedAt: Date.now() - 1000 * 60 * 15
  },
  {
    id: 'listing-farmer-17',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-papaya',
    cropName: 'Papaya (Papita)',
    grade: 'A',
    totalQuantityKg: 1800,
    availableQuantityKg: 1800,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 19,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Anantapur', area: 'Tadipatri Farm', distanceKm: 130 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoDurationSeconds: 14,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 30,
    updatedAt: Date.now() - 1000 * 60 * 30
  },
  {
    id: 'listing-farmer-18',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-watermelon',
    cropName: 'Watermelon (Tarbooz)',
    grade: 'A',
    totalQuantityKg: 3500,
    availableQuantityKg: 3500,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 13,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Pileru Valley', distanceKm: 25 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoDurationSeconds: 10,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 22,
    updatedAt: Date.now() - 1000 * 60 * 22
  },
  {
    id: 'listing-farmer-19',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    cropId: 'crop-redchilli',
    cropName: 'Dry Red Chilli (Lal Mirch)',
    grade: 'A',
    totalQuantityKg: 850,
    availableQuantityKg: 850,
    lockedPendingKg: 0,
    prebookedQuantityKg: 0,
    expectedPricePerKg: 205,
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Guntur', area: 'Kallu Yard', distanceKm: 340 },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoDurationSeconds: 16,
    status: 'AVAILABLE',
    createdAt: Date.now() - 1000 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 12
  }
];

export const INITIAL_SELL_REQUESTS: SellRequest[] = [
  {
    id: 'req-active-demo-1',
    listingId: 'listing-farmer-1',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerLocation: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri', distanceKm: 0 },
    buyerId: 'user-buyer-2',
    buyerName: 'Anand Kumar',
    buyerBusinessName: 'Southern Fresh Procurement Hub',
    marketRequirementId: 'req-blr-tomato-2',
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    requestedQuantityKg: 300,
    offeredPricePerKg: 28,
    status: 'PENDING',
    createdAt: Date.now() - 1000 * 60 * 18, // 18 mins ago
    expiresAt: Date.now() - 1000 * 60 * 18 + 1000 * 3600 // 42 mins remaining!
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-88210',
    dealCode: '#AGRI-88210',
    sellRequestId: 'req-past-1',
    listingId: 'listing-farmer-1',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    farmerLocation: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    buyerId: 'user-buyer-1',
    buyerName: 'Vikram Reddy',
    buyerBusinessName: 'Sri Balaji Agro Fresh Pvt Ltd',
    buyerMobile: '+91 94401 67890',
    buyerLocation: { country: 'India', state: 'Telangana', district: 'Hyderabad', area: 'Bowenpally Terminal', distanceKm: 520 },
    cropId: 'crop-tomato',
    cropName: 'Tomato',
    grade: 'A',
    quantityKg: 400,
    pricePerKg: 32,
    totalAmount: 12800,
    status: 'PRE_BOOKED',
    confirmedAt: Date.now() - 1000 * 60 * 95,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    farmerRated: false,
    buyerRated: false
  },
  {
    id: 'deal-88211',
    dealCode: '#AGRI-88211',
    sellRequestId: 'req-past-2',
    listingId: 'listing-farmer-4',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    farmerLocation: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    buyerId: 'user-buyer-2',
    buyerName: 'Anand Kumar',
    buyerBusinessName: 'Southern Fresh Procurement Hub',
    buyerMobile: '+91 98860 54321',
    buyerLocation: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', area: 'Yeshwanthpur Yard-B', distanceKm: 165 },
    cropId: 'crop-potato',
    cropName: 'Potato',
    grade: 'A',
    quantityKg: 350,
    pricePerKg: 20,
    totalAmount: 7000,
    status: 'CONFIRMED',
    confirmedAt: Date.now() - 1000 * 60 * 45,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    farmerRated: false,
    buyerRated: false
  },
  {
    id: 'deal-88190',
    dealCode: '#AGRI-88190',
    sellRequestId: 'req-sold-1',
    listingId: 'listing-farmer-2',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    farmerLocation: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    buyerId: 'user-buyer-3',
    buyerName: 'Rajesh Sharma',
    buyerBusinessName: 'Kolar Agro Spices Trading Co',
    buyerMobile: '+91 98765 43210',
    buyerLocation: { country: 'India', state: 'Karnataka', district: 'Kolar', area: 'Kolar APMC Yard', distanceKm: 78 },
    cropId: 'crop-chilli',
    cropName: 'Green Chilli',
    grade: 'A',
    quantityKg: 300,
    pricePerKg: 48,
    totalAmount: 14400,
    status: 'COMPLETED',
    confirmedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    completedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    farmerRated: true,
    buyerRated: true
  },
  {
    id: 'deal-88165',
    dealCode: '#AGRI-88165',
    sellRequestId: 'req-sold-2',
    listingId: 'listing-farmer-3',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    farmerLocation: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    buyerId: 'user-buyer-1',
    buyerName: 'Vikram Reddy',
    buyerBusinessName: 'Sri Balaji Agro Fresh Pvt Ltd',
    buyerMobile: '+91 94401 67890',
    buyerLocation: { country: 'India', state: 'Telangana', district: 'Hyderabad', area: 'Bowenpally Terminal', distanceKm: 520 },
    cropId: 'crop-onion',
    cropName: 'Onion',
    grade: 'A',
    quantityKg: 1000,
    pricePerKg: 31,
    totalAmount: 31000,
    status: 'COMPLETED',
    confirmedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    completedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    farmerRated: true,
    buyerRated: true
  },
  {
    id: 'deal-88120',
    dealCode: '#AGRI-88120',
    sellRequestId: 'req-sold-3',
    listingId: 'listing-farmer-8',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Naidu',
    farmerMobile: '+91 98480 12345',
    farmerLocation: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    buyerId: 'user-buyer-4',
    buyerName: 'Murugan Textiles Hub',
    buyerBusinessName: 'Coimbatore Cotton & Ginning Yard',
    buyerMobile: '+91 94888 11223',
    buyerLocation: { country: 'India', state: 'Tamil Nadu', district: 'Coimbatore', area: 'APMC Complex', distanceKm: 340 },
    cropId: 'crop-cotton',
    cropName: 'Raw Cotton (Kapas)',
    grade: 'A',
    quantityKg: 600,
    pricePerKg: 72,
    totalAmount: 43200,
    status: 'COMPLETED',
    confirmedAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
    completedAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    farmerRated: true,
    buyerRated: true
  }
];

export const INITIAL_USER_PROFILES: Record<string, UserProfile> = {
  farmer: {
    id: 'user-farmer-1',
    mobile: '+91 98480 12345',
    name: 'Ramesh Naidu',
    role: 'FARMER',
    language: 'en',
    location: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 0 },
    ratingAvg: 4.8,
    ratingCount: 14,
    avatarUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80'
  },
  buyer: {
    id: 'user-buyer-2',
    mobile: '+91 98860 54321',
    name: 'Anand Kumar',
    role: 'BUYER',
    businessName: 'Southern Fresh Procurement Hub',
    businessType: 'WHOLESALER',
    isVerified: true,
    gstNumber: '29ABCDE1234F1Z5',
    apmcLicense: 'KA/BLR/APMC/2021/984',
    language: 'en',
    location: { country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', area: 'Yeshwanthpur Yard-B', distanceKm: 165 },
    ratingAvg: 4.9,
    ratingCount: 38,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
};

// 30-Day Historical Price & Volume Points Generator (Logging Every Single Day)
const generate30DayTrend = (basePrice: number, volatility: number, baseArrivalsKg = 30000, basePrebookedKg = 8000) => {
  const points = [];
  const baseTime = new Date('2026-10-10T12:00:00Z').getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  let prevPrice = basePrice;
  for (let i = 30; i >= 1; i--) {
    const timestamp = baseTime - (i - 1) * dayMs;
    const d = new Date(timestamp);
    const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const dayOfWeek = d.toLocaleDateString('en-IN', { weekday: 'short' });

    const wave = Math.sin((31 - i) / 3) * volatility;
    const randomVariation = (((31 - i) % 5) - 2) * 0.4;
    const price = Math.max(5, Math.round((basePrice + wave + randomVariation) * 10) / 10);
    const minPrice = Math.round(price * 0.92 * 10) / 10;
    const maxPrice = Math.round(price * 1.08 * 10) / 10;
    const change = i === 30 ? 0 : Math.round((price - prevPrice) * 10) / 10;
    const changePercent = prevPrice > 0 ? Math.round((change / prevPrice) * 1000) / 10 : 0;
    prevPrice = price;

    // Arrival & prebooked variation over 30 days
    const volWave = Math.cos((31 - i) / 4) * 0.2;
    const arrivalsKg = Math.round(baseArrivalsKg * (1 + volWave + (((31 - i) % 3) - 1) * 0.05));
    const prebookedKg = Math.round(basePrebookedKg * (1 + volWave * 0.8 + (((31 - i) % 2) - 0.5) * 0.05));

    const dayLabel = i === 1 ? 'Today' : i === 2 ? 'Yesterday' : `${d.getDate()} ${d.toLocaleDateString('en-IN', { month: 'short' })}`;

    points.push({
      dayIndex: 31 - i,
      date,
      dayLabel,
      dayOfWeek,
      price,
      minPrice,
      maxPrice,
      change,
      changePercent,
      arrivalsKg,
      prebookedKg
    });
  }
  return points;
};

export const INITIAL_MARKET_HUBS: MarketHub[] = [
  {
    id: 'hub-madanapalle',
    marketName: 'Madanapalle Tomato APMC Mandi',
    localName: 'మదనపల్లె టమాటా మార్కెట్ యార్డ్',
    state: 'Andhra Pradesh',
    district: 'Chittoor',
    area: 'Madanapalle APMC',
    distanceKm: 28,
    dailyTotalImportTons: 420,
    totalPrebookedKg: 34500,
    verifiedAPMC: true,
    bulletin: 'High Demand: Tomato Grade A needed for interstate dispatch to Chennai & Bengaluru',
    isFollowing: true,
    highDemand: true,
    cropPrices: [
      {
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        cropIcon: '🍅',
        grade: 'A',
        pricePerKg: 34,
        yesterdayPrice: 31,
        minPrice: 28,
        maxPrice: 36,
        openQuantityKg: 6500,
        dailyArrivalsKg: 95000,
        prebookedKg: 32000,
        thirtyDayImportTons: 2850,
        thirtyDayPrebookedKg: 960000,
        thirtyDayTrend: generate30DayTrend(32, 3.5, 95000, 32000)
      },
      {
        cropId: 'crop-potato',
        cropName: 'Potato',
        cropIcon: '🥔',
        grade: 'A',
        pricePerKg: 28,
        yesterdayPrice: 27,
        minPrice: 24,
        maxPrice: 30,
        openQuantityKg: 7000,
        dailyArrivalsKg: 60000,
        prebookedKg: 18000,
        thirtyDayImportTons: 1800,
        thirtyDayPrebookedKg: 540000,
        thirtyDayTrend: generate30DayTrend(26, 2.2, 60000, 18000)
      },
      {
        cropId: 'crop-rice',
        cropName: 'Rice',
        cropIcon: '🌾',
        grade: 'A',
        pricePerKg: 24,
        yesterdayPrice: 23,
        minPrice: 22,
        maxPrice: 26,
        openQuantityKg: 11000,
        dailyArrivalsKg: 75000,
        prebookedKg: 25000,
        thirtyDayImportTons: 2250,
        thirtyDayPrebookedKg: 750000,
        thirtyDayTrend: generate30DayTrend(23.5, 1.5, 75000, 25000)
      },
      {
        cropId: 'crop-chilli',
        cropName: 'Green Chilli',
        cropIcon: '🌶️',
        grade: 'A',
        pricePerKg: 48,
        yesterdayPrice: 46,
        minPrice: 42,
        maxPrice: 52,
        openQuantityKg: 2800,
        dailyArrivalsKg: 40000,
        prebookedKg: 14000,
        thirtyDayImportTons: 1200,
        thirtyDayPrebookedKg: 420000,
        thirtyDayTrend: generate30DayTrend(45, 4, 40000, 14000)
      }
    ]
  },
  {
    id: 'hub-hyderabad',
    marketName: 'Hyderabad Bowenpally Terminal Yard',
    localName: 'హైదరాబాద్ బోయిన్‌పల్లి మార్కెట్',
    state: 'Telangana',
    district: 'Hyderabad',
    area: 'Bowenpally Terminal',
    distanceKm: 520,
    dailyTotalImportTons: 720,
    totalPrebookedKg: 58000,
    verifiedAPMC: true,
    bulletin: 'Heavy Inflow: Steady procurement across vegetables and grains',
    isFollowing: false,
    highDemand: true,
    cropPrices: [
      {
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        cropIcon: '🍅',
        grade: 'A',
        pricePerKg: 26,
        yesterdayPrice: 25,
        minPrice: 23,
        maxPrice: 28,
        dailyArrivalsKg: 140000,
        prebookedKg: 38000,
        thirtyDayImportTons: 4200,
        thirtyDayPrebookedKg: 1140000,
        thirtyDayTrend: generate30DayTrend(24.5, 3, 140000, 38000)
      },
      {
        cropId: 'crop-onion',
        cropName: 'Onion',
        cropIcon: '🧅',
        grade: 'A',
        pricePerKg: 33,
        yesterdayPrice: 32,
        minPrice: 30,
        maxPrice: 35,
        dailyArrivalsKg: 110000,
        prebookedKg: 32000,
        thirtyDayImportTons: 3300,
        thirtyDayPrebookedKg: 960000,
        thirtyDayTrend: generate30DayTrend(30, 3.5, 110000, 32000)
      },
      {
        cropId: 'crop-chilli',
        cropName: 'Green Chilli',
        cropIcon: '🌶️',
        grade: 'A',
        pricePerKg: 49,
        yesterdayPrice: 47,
        minPrice: 44,
        maxPrice: 52,
        dailyArrivalsKg: 45000,
        prebookedKg: 14500,
        thirtyDayImportTons: 1350,
        thirtyDayPrebookedKg: 435000,
        thirtyDayTrend: generate30DayTrend(46, 4.2, 45000, 14500)
      },
      {
        cropId: 'crop-cotton',
        cropName: 'Raw Cotton (Kapas)',
        cropIcon: '☁️',
        grade: 'A',
        pricePerKg: 66,
        yesterdayPrice: 65,
        minPrice: 62,
        maxPrice: 70,
        dailyArrivalsKg: 85000,
        prebookedKg: 22000,
        thirtyDayImportTons: 2550,
        thirtyDayPrebookedKg: 660000,
        thirtyDayTrend: generate30DayTrend(63, 5, 85000, 22000)
      },
      {
        cropId: 'crop-potato',
        cropName: 'Potato',
        cropIcon: '🥔',
        grade: 'A',
        pricePerKg: 22,
        yesterdayPrice: 21,
        minPrice: 19,
        maxPrice: 24,
        dailyArrivalsKg: 95000,
        prebookedKg: 26000,
        thirtyDayImportTons: 2850,
        thirtyDayPrebookedKg: 780000,
        thirtyDayTrend: generate30DayTrend(21, 2.5, 95000, 26000)
      },
      {
        cropId: 'crop-rice',
        cropName: 'Paddy Rice (BPT 5204)',
        cropIcon: '🌾',
        grade: 'A',
        pricePerKg: 34,
        yesterdayPrice: 33,
        minPrice: 31,
        maxPrice: 36,
        dailyArrivalsKg: 120000,
        prebookedKg: 42000,
        thirtyDayImportTons: 3600,
        thirtyDayPrebookedKg: 1260000,
        thirtyDayTrend: generate30DayTrend(32, 2.8, 120000, 42000)
      },
      {
        cropId: 'crop-maize',
        cropName: 'Yellow Maize / Corn',
        cropIcon: '🌽',
        grade: 'A',
        pricePerKg: 21,
        yesterdayPrice: 20,
        minPrice: 18,
        maxPrice: 23,
        dailyArrivalsKg: 60000,
        prebookedKg: 18000,
        thirtyDayImportTons: 1800,
        thirtyDayPrebookedKg: 540000,
        thirtyDayTrend: generate30DayTrend(19.5, 2.2, 60000, 18000)
      },
      {
        cropId: 'crop-mango',
        cropName: 'Mango (Banganapalli)',
        cropIcon: '🥭',
        grade: 'A',
        pricePerKg: 68,
        yesterdayPrice: 65,
        minPrice: 60,
        maxPrice: 75,
        dailyArrivalsKg: 35000,
        prebookedKg: 16000,
        thirtyDayImportTons: 1050,
        thirtyDayPrebookedKg: 480000,
        thirtyDayTrend: generate30DayTrend(62, 7, 35000, 16000)
      }
    ]
  },
  {
    id: 'hub-bengaluru',
    marketName: 'Bengaluru Yeshwanthpur APMC Yard',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    area: 'Yeshwanthpur Yard',
    distanceKm: 165,
    dailyTotalImportTons: 850,
    totalPrebookedKg: 64500,
    verifiedAPMC: true,
    cropPrices: [
      {
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        cropIcon: '🍅',
        grade: 'A',
        pricePerKg: 28,
        yesterdayPrice: 27,
        minPrice: 25,
        maxPrice: 30,
        dailyArrivalsKg: 160000,
        prebookedKg: 45000,
        thirtyDayImportTons: 4800,
        thirtyDayPrebookedKg: 1350000,
        thirtyDayTrend: generate30DayTrend(26, 3.2, 160000, 45000)
      },
      {
        cropId: 'crop-onion',
        cropName: 'Onion',
        cropIcon: '🧅',
        grade: 'A',
        pricePerKg: 34,
        yesterdayPrice: 33,
        minPrice: 31,
        maxPrice: 36,
        dailyArrivalsKg: 130000,
        prebookedKg: 36000,
        thirtyDayImportTons: 3900,
        thirtyDayPrebookedKg: 1080000,
        thirtyDayTrend: generate30DayTrend(31.5, 3, 130000, 36000)
      },
      {
        cropId: 'crop-chilli',
        cropName: 'Green Chilli',
        cropIcon: '🌶️',
        grade: 'A',
        pricePerKg: 52,
        yesterdayPrice: 50,
        minPrice: 47,
        maxPrice: 55,
        dailyArrivalsKg: 50000,
        prebookedKg: 16000,
        thirtyDayImportTons: 1500,
        thirtyDayPrebookedKg: 480000,
        thirtyDayTrend: generate30DayTrend(48, 4, 50000, 16000)
      },
      {
        cropId: 'crop-potato',
        cropName: 'Potato',
        cropIcon: '🥔',
        grade: 'A',
        pricePerKg: 24,
        yesterdayPrice: 23,
        minPrice: 21,
        maxPrice: 26,
        dailyArrivalsKg: 90000,
        prebookedKg: 24000,
        thirtyDayImportTons: 2700,
        thirtyDayPrebookedKg: 720000,
        thirtyDayTrend: generate30DayTrend(22, 2.2, 90000, 24000)
      },
      {
        cropId: 'crop-rice',
        cropName: 'Paddy Rice (Sona Masoori)',
        cropIcon: '🌾',
        grade: 'A',
        pricePerKg: 36,
        yesterdayPrice: 35,
        minPrice: 33,
        maxPrice: 38,
        dailyArrivalsKg: 110000,
        prebookedKg: 35000,
        thirtyDayImportTons: 3300,
        thirtyDayPrebookedKg: 1050000,
        thirtyDayTrend: generate30DayTrend(34, 2.5, 110000, 35000)
      },
      {
        cropId: 'crop-mango',
        cropName: 'Mango (Alphonso & Raspuri)',
        cropIcon: '🥭',
        grade: 'A',
        pricePerKg: 85,
        yesterdayPrice: 82,
        minPrice: 75,
        maxPrice: 95,
        dailyArrivalsKg: 40000,
        prebookedKg: 19000,
        thirtyDayImportTons: 1200,
        thirtyDayPrebookedKg: 570000,
        thirtyDayTrend: generate30DayTrend(78, 8, 40000, 19000)
      }
    ]
  },
  {
    id: 'hub-chittoor',
    marketName: 'Chittoor APMC Market Yard',
    state: 'Andhra Pradesh',
    district: 'Chittoor',
    area: 'Chittoor Town',
    distanceKm: 18,
    dailyTotalImportTons: 185,
    totalPrebookedKg: 14200,
    verifiedAPMC: true,
    cropPrices: [
      {
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        cropIcon: '🍅',
        grade: 'A',
        pricePerKg: 22,
        yesterdayPrice: 21,
        minPrice: 19,
        maxPrice: 23,
        dailyArrivalsKg: 45000,
        prebookedKg: 12000,
        thirtyDayImportTons: 1350,
        thirtyDayPrebookedKg: 360000,
        thirtyDayTrend: generate30DayTrend(21, 2.5, 45000, 12000)
      },
      {
        cropId: 'crop-onion',
        cropName: 'Onion',
        cropIcon: '🧅',
        grade: 'A',
        pricePerKg: 27,
        yesterdayPrice: 26,
        minPrice: 24,
        maxPrice: 29,
        dailyArrivalsKg: 35000,
        prebookedKg: 9500,
        thirtyDayImportTons: 1050,
        thirtyDayPrebookedKg: 285000,
        thirtyDayTrend: generate30DayTrend(25, 3, 35000, 9500)
      },
      {
        cropId: 'crop-chilli',
        cropName: 'Green Chilli',
        cropIcon: '🌶️',
        grade: 'A',
        pricePerKg: 44,
        yesterdayPrice: 43,
        minPrice: 40,
        maxPrice: 47,
        dailyArrivalsKg: 18000,
        prebookedKg: 6200,
        thirtyDayImportTons: 540,
        thirtyDayPrebookedKg: 186000,
        thirtyDayTrend: generate30DayTrend(42, 4, 18000, 6200)
      },
      {
        cropId: 'crop-potato',
        cropName: 'Potato',
        cropIcon: '🥔',
        grade: 'A',
        pricePerKg: 19,
        yesterdayPrice: 19,
        minPrice: 17,
        maxPrice: 21,
        dailyArrivalsKg: 22000,
        prebookedKg: 4000,
        thirtyDayImportTons: 660,
        thirtyDayPrebookedKg: 120000,
        thirtyDayTrend: generate30DayTrend(18.5, 1.5, 22000, 4000)
      },
      {
        cropId: 'crop-mango',
        cropName: 'Mango (Totapuri / Processing)',
        cropIcon: '🥭',
        grade: 'A',
        pricePerKg: 28,
        yesterdayPrice: 26,
        minPrice: 24,
        maxPrice: 31,
        dailyArrivalsKg: 55000,
        prebookedKg: 24000,
        thirtyDayImportTons: 1650,
        thirtyDayPrebookedKg: 720000,
        thirtyDayTrend: generate30DayTrend(25, 3.5, 55000, 24000)
      },
      {
        cropId: 'crop-rice',
        cropName: 'Paddy Rice',
        cropIcon: '🌾',
        grade: 'A',
        pricePerKg: 30,
        yesterdayPrice: 29,
        minPrice: 28,
        maxPrice: 32,
        dailyArrivalsKg: 28000,
        prebookedKg: 7500,
        thirtyDayImportTons: 840,
        thirtyDayPrebookedKg: 225000,
        thirtyDayTrend: generate30DayTrend(29, 1.8, 28000, 7500)
      }
    ]
  },
  {
    id: 'hub-tirupati',
    marketName: 'Tirupati Agricultural Mandi',
    state: 'Andhra Pradesh',
    district: 'Tirupati',
    area: 'Renigunta Road',
    distanceKm: 42,
    dailyTotalImportTons: 260,
    totalPrebookedKg: 21500,
    verifiedAPMC: true,
    cropPrices: [
      {
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        cropIcon: '🍅',
        grade: 'A',
        pricePerKg: 24,
        yesterdayPrice: 23,
        minPrice: 21,
        maxPrice: 25,
        dailyArrivalsKg: 55000,
        prebookedKg: 16000,
        thirtyDayImportTons: 1650,
        thirtyDayPrebookedKg: 480000,
        thirtyDayTrend: generate30DayTrend(22.5, 2.8, 55000, 16000)
      },
      {
        cropId: 'crop-onion',
        cropName: 'Onion',
        cropIcon: '🧅',
        grade: 'A',
        pricePerKg: 29,
        yesterdayPrice: 28,
        minPrice: 26,
        maxPrice: 31,
        dailyArrivalsKg: 40000,
        prebookedKg: 11000,
        thirtyDayImportTons: 1200,
        thirtyDayPrebookedKg: 330000,
        thirtyDayTrend: generate30DayTrend(27, 2.5, 40000, 11000)
      },
      {
        cropId: 'crop-chilli',
        cropName: 'Green Chilli',
        cropIcon: '🌶️',
        grade: 'A',
        pricePerKg: 46,
        yesterdayPrice: 45,
        minPrice: 42,
        maxPrice: 49,
        dailyArrivalsKg: 24000,
        prebookedKg: 8500,
        thirtyDayImportTons: 720,
        thirtyDayPrebookedKg: 255000,
        thirtyDayTrend: generate30DayTrend(43, 3.5, 24000, 8500)
      },
      {
        cropId: 'crop-rice',
        cropName: 'Paddy Rice',
        cropIcon: '🌾',
        grade: 'A',
        pricePerKg: 32,
        yesterdayPrice: 32,
        minPrice: 30,
        maxPrice: 34,
        dailyArrivalsKg: 65000,
        prebookedKg: 18000,
        thirtyDayImportTons: 1950,
        thirtyDayPrebookedKg: 540000,
        thirtyDayTrend: generate30DayTrend(31, 1.8, 65000, 18000)
      },
      {
        cropId: 'crop-potato',
        cropName: 'Potato',
        cropIcon: '🥔',
        grade: 'A',
        pricePerKg: 20,
        yesterdayPrice: 20,
        minPrice: 18,
        maxPrice: 22,
        dailyArrivalsKg: 30000,
        prebookedKg: 7000,
        thirtyDayImportTons: 900,
        thirtyDayPrebookedKg: 210000,
        thirtyDayTrend: generate30DayTrend(19, 1.5, 30000, 7000)
      },
      {
        cropId: 'crop-mango',
        cropName: 'Mango (Neelam)',
        cropIcon: '🥭',
        grade: 'A',
        pricePerKg: 42,
        yesterdayPrice: 40,
        minPrice: 36,
        maxPrice: 46,
        dailyArrivalsKg: 35000,
        prebookedKg: 13000,
        thirtyDayImportTons: 1050,
        thirtyDayPrebookedKg: 390000,
        thirtyDayTrend: generate30DayTrend(38, 4.5, 35000, 13000)
      }
    ]
  },
  {
    id: 'hub-guntur',
    marketName: 'Guntur Mirchi & Agriculture Yard',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    area: 'Mirchi Yard Road',
    distanceKm: 380,
    dailyTotalImportTons: 1100,
    totalPrebookedKg: 85000,
    verifiedAPMC: true,
    cropPrices: [
      {
        cropId: 'crop-chilli',
        cropName: 'Green Chilli (Teja / Guntur Special)',
        cropIcon: '🌶️',
        grade: 'A',
        pricePerKg: 58,
        yesterdayPrice: 55,
        minPrice: 52,
        maxPrice: 62,
        dailyArrivalsKg: 280000,
        prebookedKg: 95000,
        thirtyDayImportTons: 8400,
        thirtyDayPrebookedKg: 2850000,
        thirtyDayTrend: generate30DayTrend(52, 5.5, 280000, 95000)
      },
      {
        cropId: 'crop-cotton',
        cropName: 'Raw Cotton (Kapas Shankar-6)',
        cropIcon: '☁️',
        grade: 'A',
        pricePerKg: 68,
        yesterdayPrice: 67,
        minPrice: 63,
        maxPrice: 72,
        dailyArrivalsKg: 190000,
        prebookedKg: 54000,
        thirtyDayImportTons: 5700,
        thirtyDayPrebookedKg: 1620000,
        thirtyDayTrend: generate30DayTrend(65, 4.8, 190000, 54000)
      },
      {
        cropId: 'crop-rice',
        cropName: 'Paddy Rice (BPT 5204)',
        cropIcon: '🌾',
        grade: 'A',
        pricePerKg: 35,
        yesterdayPrice: 34,
        minPrice: 32,
        maxPrice: 37,
        dailyArrivalsKg: 140000,
        prebookedKg: 46000,
        thirtyDayImportTons: 4200,
        thirtyDayPrebookedKg: 1380000,
        thirtyDayTrend: generate30DayTrend(33, 2.5, 140000, 46000)
      },
      {
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        cropIcon: '🍅',
        grade: 'A',
        pricePerKg: 23,
        yesterdayPrice: 22,
        minPrice: 20,
        maxPrice: 25,
        dailyArrivalsKg: 80000,
        prebookedKg: 22000,
        thirtyDayImportTons: 2400,
        thirtyDayPrebookedKg: 660000,
        thirtyDayTrend: generate30DayTrend(22, 2.7, 80000, 22000)
      },
      {
        cropId: 'crop-onion',
        cropName: 'Onion',
        cropIcon: '🧅',
        grade: 'A',
        pricePerKg: 30,
        yesterdayPrice: 29,
        minPrice: 27,
        maxPrice: 32,
        dailyArrivalsKg: 75000,
        prebookedKg: 20000,
        thirtyDayImportTons: 2250,
        thirtyDayPrebookedKg: 600000,
        thirtyDayTrend: generate30DayTrend(28, 2.9, 75000, 20000)
      },
      {
        cropId: 'crop-maize',
        cropName: 'Corn / Maize',
        cropIcon: '🌽',
        grade: 'A',
        pricePerKg: 22,
        yesterdayPrice: 21,
        minPrice: 19,
        maxPrice: 24,
        dailyArrivalsKg: 60000,
        prebookedKg: 17000,
        thirtyDayImportTons: 1800,
        thirtyDayPrebookedKg: 510000,
        thirtyDayTrend: generate30DayTrend(20.5, 2.1, 60000, 17000)
      }
    ]
  },
  {
    id: 'hub-mumbai',
    marketName: 'Vashi Turbhe APMC Navi Mumbai',
    state: 'Maharashtra',
    district: 'Thane / Mumbai',
    area: 'Turbhe APMC',
    distanceKm: 980,
    dailyTotalImportTons: 1400,
    totalPrebookedKg: 92000,
    verifiedAPMC: true,
    cropPrices: [
      {
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        cropIcon: '🍅',
        grade: 'A',
        pricePerKg: 31,
        yesterdayPrice: 30,
        minPrice: 28,
        maxPrice: 33,
        dailyArrivalsKg: 220000,
        prebookedKg: 65000,
        thirtyDayImportTons: 6600,
        thirtyDayPrebookedKg: 1950000,
        thirtyDayTrend: generate30DayTrend(28.5, 3.8, 220000, 65000)
      },
      {
        cropId: 'crop-onion',
        cropName: 'Onion (Nashik Fresh)',
        cropIcon: '🧅',
        grade: 'A',
        pricePerKg: 35,
        yesterdayPrice: 34,
        minPrice: 32,
        maxPrice: 38,
        dailyArrivalsKg: 280000,
        prebookedKg: 85000,
        thirtyDayImportTons: 8400,
        thirtyDayPrebookedKg: 2550000,
        thirtyDayTrend: generate30DayTrend(32, 4, 280000, 85000)
      },
      {
        cropId: 'crop-chilli',
        cropName: 'Green Chilli',
        cropIcon: '🌶️',
        grade: 'A',
        pricePerKg: 56,
        yesterdayPrice: 54,
        minPrice: 50,
        maxPrice: 60,
        dailyArrivalsKg: 70000,
        prebookedKg: 22000,
        thirtyDayImportTons: 2100,
        thirtyDayPrebookedKg: 660000,
        thirtyDayTrend: generate30DayTrend(51, 4.5, 70000, 22000)
      },
      {
        cropId: 'crop-potato',
        cropName: 'Potato',
        cropIcon: '🥔',
        grade: 'A',
        pricePerKg: 25,
        yesterdayPrice: 24,
        minPrice: 22,
        maxPrice: 27,
        dailyArrivalsKg: 180000,
        prebookedKg: 52000,
        thirtyDayImportTons: 5400,
        thirtyDayPrebookedKg: 1560000,
        thirtyDayTrend: generate30DayTrend(23, 2.6, 180000, 52000)
      },
      {
        cropId: 'crop-cotton',
        cropName: 'Raw Cotton',
        cropIcon: '☁️',
        grade: 'A',
        pricePerKg: 67,
        yesterdayPrice: 66,
        minPrice: 62,
        maxPrice: 71,
        dailyArrivalsKg: 110000,
        prebookedKg: 34000,
        thirtyDayImportTons: 3300,
        thirtyDayPrebookedKg: 1020000,
        thirtyDayTrend: generate30DayTrend(64, 4.2, 110000, 34000)
      },
      {
        cropId: 'crop-mango',
        cropName: 'Mango (Devgad Alphonso / Hapus)',
        cropIcon: '🥭',
        grade: 'A',
        pricePerKg: 120,
        yesterdayPrice: 115,
        minPrice: 100,
        maxPrice: 140,
        dailyArrivalsKg: 60000,
        prebookedKg: 28000,
        thirtyDayImportTons: 1800,
        thirtyDayPrebookedKg: 840000,
        thirtyDayTrend: generate30DayTrend(105, 12, 60000, 28000)
      }
    ]
  },
  {
    id: 'hub-delhi',
    marketName: 'Azadpur Fruits & Vegetables Mandi',
    state: 'Delhi',
    district: 'North Delhi',
    area: 'Azadpur',
    distanceKm: 2150,
    dailyTotalImportTons: 2200,
    totalPrebookedKg: 140000,
    verifiedAPMC: true,
    cropPrices: [
      {
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        cropIcon: '🍅',
        grade: 'A',
        pricePerKg: 34,
        yesterdayPrice: 33,
        minPrice: 30,
        maxPrice: 36,
        dailyArrivalsKg: 350000,
        prebookedKg: 95000,
        thirtyDayImportTons: 10500,
        thirtyDayPrebookedKg: 2850000,
        thirtyDayTrend: generate30DayTrend(31, 4.2, 350000, 95000)
      },
      {
        cropId: 'crop-onion',
        cropName: 'Onion',
        cropIcon: '🧅',
        grade: 'A',
        pricePerKg: 38,
        yesterdayPrice: 37,
        minPrice: 34,
        maxPrice: 41,
        dailyArrivalsKg: 400000,
        prebookedKg: 120000,
        thirtyDayImportTons: 12000,
        thirtyDayPrebookedKg: 3600000,
        thirtyDayTrend: generate30DayTrend(34, 4.8, 400000, 120000)
      },
      {
        cropId: 'crop-potato',
        cropName: 'Potato',
        cropIcon: '🥔',
        grade: 'A',
        pricePerKg: 27,
        yesterdayPrice: 26,
        minPrice: 24,
        maxPrice: 29,
        dailyArrivalsKg: 300000,
        prebookedKg: 80000,
        thirtyDayImportTons: 9000,
        thirtyDayPrebookedKg: 2400000,
        thirtyDayTrend: generate30DayTrend(25, 2.8, 300000, 80000)
      },
      {
        cropId: 'crop-chilli',
        cropName: 'Green Chilli',
        cropIcon: '🌶️',
        grade: 'A',
        pricePerKg: 62,
        yesterdayPrice: 60,
        minPrice: 56,
        maxPrice: 67,
        dailyArrivalsKg: 90000,
        prebookedKg: 29000,
        thirtyDayImportTons: 2700,
        thirtyDayPrebookedKg: 870000,
        thirtyDayTrend: generate30DayTrend(57, 5, 90000, 29000)
      },
      {
        cropId: 'crop-rice',
        cropName: 'Basmati Paddy (Pusa 1121)',
        cropIcon: '🌾',
        grade: 'A',
        pricePerKg: 42,
        yesterdayPrice: 41,
        minPrice: 38,
        maxPrice: 45,
        dailyArrivalsKg: 220000,
        prebookedKg: 65000,
        thirtyDayImportTons: 6600,
        thirtyDayPrebookedKg: 1950000,
        thirtyDayTrend: generate30DayTrend(39, 3.5, 220000, 65000)
      },
      {
        cropId: 'crop-cotton',
        cropName: 'Raw Cotton',
        cropIcon: '☁️',
        grade: 'A',
        pricePerKg: 69,
        yesterdayPrice: 68,
        minPrice: 65,
        maxPrice: 73,
        dailyArrivalsKg: 130000,
        prebookedKg: 38000,
        thirtyDayImportTons: 3900,
        thirtyDayPrebookedKg: 1140000,
        thirtyDayTrend: generate30DayTrend(66, 4.5, 130000, 38000)
      }
    ]
  }
];
