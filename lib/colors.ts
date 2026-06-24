export type RarityCategory = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Legendary'

export interface PorscheColor {
  slug: string
  name: string
  code: string
  family: string
  availability: string
  generations: string[]
  models: string[]
  rarityCategory: RarityCategory
  rarityScore: number
  hex: [string, string]
  historical: string
}

export const COLORS: PorscheColor[] = [
  { slug: 'guards-red', name: 'Guards Red', code: 'G1', family: 'Red', availability: '1974–present', generations: ['911 G-Series','964','993','996','997','991','992'], rarityCategory: 'Common', rarityScore: 5, models: ['911','Boxster','Cayman','Panamera','Taycan'], hex: ['#d5001c','#7d0011'], historical: 'A defining Porsche red, frequently associated with sports cars, dealer inventory, and enthusiast posters.' },
  { slug: 'carrara-white', name: 'Carrara White', code: 'B9A', family: 'White', availability: '2005–present', generations: ['997','987','991','981','982','992'], rarityCategory: 'Common', rarityScore: 5, models: ['911','Cayman','Boxster','Macan','Cayenne'], hex: ['#f4f3ee','#cfd2d1'], historical: 'A clean modern white seen across Porsche sports cars and SUVs.' },
  { slug: 'gt-silver', name: 'GT Silver Metallic', code: 'M7Z', family: 'Silver', availability: '2004–present', generations: ['Carrera GT','997','991','992'], rarityCategory: 'Uncommon', rarityScore: 15, models: ['Carrera GT','911','Cayman','Boxster'], hex: ['#c8c9c7','#74787d'], historical: 'A premium metallic silver made famous by the Carrera GT and later GT cars.' },
  { slug: 'agate-grey', name: 'Agate Grey Metallic', code: 'M7S', family: 'Grey', availability: '2012–present', generations: ['991','981','982','992'], rarityCategory: 'Common', rarityScore: 5, models: ['911','Cayman','Boxster','Macan'], hex: ['#62666b','#26282d'], historical: 'A restrained modern grey that became a popular configurator choice.' },
  { slug: 'shark-blue', name: 'Shark Blue', code: 'D5C', family: 'Blue', availability: '2021–present', generations: ['992','982'], rarityCategory: 'Rare', rarityScore: 50, models: ['911 GT3','Cayman GT4 RS','718'], hex: ['#008bd2','#004b88'], historical: 'A vivid contemporary blue strongly linked with modern GT cars.' },
  { slug: 'miami-blue', name: 'Miami Blue', code: 'M5C', family: 'Blue', availability: '2016–2020', generations: ['991.2','982'], rarityCategory: 'Rare', rarityScore: 50, models: ['911','718','Macan'], hex: ['#00a7d6','#006d90'], historical: 'A loud non-metallic blue that became a modern collector favorite.' },
  { slug: 'voodoo-blue', name: 'Voodoo Blue', code: 'PTS', family: 'Blue', availability: 'Paint to Sample', generations: ['997','991','992','982'], rarityCategory: 'Ultra Rare', rarityScore: 100, models: ['911','Cayman','Boxster'], hex: ['#0074d9','#003c8f'], historical: 'A Paint to Sample blue with a saturated motorsport character.' },
  { slug: 'riviera-blue', name: 'Riviera Blue', code: 'M3W', family: 'Blue', availability: '1992–1998', generations: ['964','993'], rarityCategory: 'Rare', rarityScore: 50, models: ['911','968'], hex: ['#4682b4','#1e3f5c'], historical: 'An air-cooled era blue with strong associations with 964 and early 993 Porsches.' },
  { slug: 'maritime-blue', name: 'Maritime Blue Metallic', code: 'M5H', family: 'Blue', availability: '2003–2009', generations: ['997','987'], rarityCategory: 'Uncommon', rarityScore: 15, models: ['911','Boxster','Cayman'], hex: ['#1b4f72','#0e2840'], historical: 'A deep nautical blue used in the 997 and 987 era.' },
  { slug: 'oak-green', name: 'Oak Green Metallic', code: 'PTS', family: 'Green', availability: '2021–present', generations: ['992','982'], rarityCategory: 'Ultra Rare', rarityScore: 100, models: ['911','718'], hex: ['#4a6741','#243525'], historical: 'A sophisticated earthy green only available as Paint to Sample on recent models.' },
  { slug: 'irish-green', name: 'Irish Green', code: '227', family: 'Green', availability: '1970–1977', generations: ['911 G-Series'], rarityCategory: 'Legendary', rarityScore: 250, models: ['911'], hex: ['#2e7d32','#145214'], historical: 'A vivid 1970s green synonymous with the air-cooled era. Extremely rare in the wild.' },
  { slug: 'python-green', name: 'Python Green', code: 'PTS', family: 'Green', availability: 'Paint to Sample', generations: ['997','991','992','982'], rarityCategory: 'Ultra Rare', rarityScore: 100, models: ['911','Cayman','Boxster'], hex: ['#1a7a4a','#0b3d25'], historical: 'A Paint to Sample green with a bold, saturated character favored by collectors.' },
  { slug: 'signal-green', name: 'Signal Green', code: 'L61K', family: 'Green', availability: '1969–1973', generations: ['911 G-Series'], rarityCategory: 'Legendary', rarityScore: 250, models: ['911'], hex: ['#4caf50','#2e7d32'], historical: 'A classic 1970s lime-green color. Seldom seen outside a museum.' },
  { slug: 'speed-yellow', name: 'Speed Yellow', code: 'P9', family: 'Yellow', availability: '1993–present', generations: ['993','996','997','991','992','982'], rarityCategory: 'Uncommon', rarityScore: 15, models: ['911','Boxster','Cayman'], hex: ['#f7c531','#b8900d'], historical: 'Porsche\'s iconic sports yellow — bright, polarizing, and unmistakable.' },
  { slug: 'racing-yellow', name: 'Racing Yellow', code: 'P16', family: 'Yellow', availability: '1970–1986', generations: ['911 G-Series'], rarityCategory: 'Rare', rarityScore: 50, models: ['911'], hex: ['#e8b000','#9a7300'], historical: 'A vibrant period correct yellow linked to early 911 competition cars.' },
  { slug: 'rubystone-red', name: 'Rubystone Red', code: 'M8M', family: 'Red', availability: '1994–1998', generations: ['993'], rarityCategory: 'Rare', rarityScore: 50, models: ['911'], hex: ['#8b1a1a','#5c1111'], historical: 'A deep ruby metallic from the 993 generation. A proper archive find.' },
  { slug: 'ruby-star-neo', name: 'Ruby Star Neo', code: 'PTS', family: 'Red', availability: 'Paint to Sample', generations: ['992','982'], rarityCategory: 'Ultra Rare', rarityScore: 100, models: ['911','718'], hex: ['#9b111e','#5e0a12'], historical: 'A contemporary PTS red with an almost iridescent depth of color.' },
  { slug: 'lava-orange', name: 'Lava Orange', code: 'P2N', family: 'Orange', availability: '2011–2016', generations: ['991','981'], rarityCategory: 'Rare', rarityScore: 50, models: ['911','Cayman','Boxster'], hex: ['#ff5800','#c04000'], historical: 'A fiery orange that polarized configurators and sold out quickly.' },
  { slug: 'gulf-orange', name: 'Gulf Orange', code: 'PTS', family: 'Orange', availability: 'Paint to Sample', generations: ['992'], rarityCategory: 'Ultra Rare', rarityScore: 100, models: ['911'], hex: ['#f76900','#b54e00'], historical: 'A race-heritage inspired PTS orange evoking the Gulf livery era.' },
  { slug: 'signal-orange', name: 'Signal Orange', code: 'B14', family: 'Orange', availability: '1976–1980', generations: ['911 G-Series'], rarityCategory: 'Legendary', rarityScore: 250, models: ['911'], hex: ['#ff6600','#cc5200'], historical: 'A period orange that barely escaped the catalog era. Virtually extinct.' },
  { slug: 'chalk', name: 'Chalk', code: 'M9Y', family: 'White', availability: '2016–present', generations: ['991.2','992','982'], rarityCategory: 'Uncommon', rarityScore: 15, models: ['911','718','Taycan'], hex: ['#d8d5cc','#b0ad9f'], historical: 'A matte-compatible warm off-white introduced with the 991.2. Elegant and modern.' },
  { slug: 'crayon', name: 'Crayon', code: 'M9Z', family: 'White', availability: '2019–present', generations: ['992','982'], rarityCategory: 'Uncommon', rarityScore: 15, models: ['911','718'], hex: ['#e8e6e0','#c0bdb0'], historical: 'A slightly warmer variant of Chalk, introduced for the 992 generation.' },
  { slug: 'arctic-grey', name: 'Arctic Silver Metallic', code: 'M7X', family: 'Grey', availability: '2003–2012', generations: ['997','987'], rarityCategory: 'Common', rarityScore: 5, models: ['911','Boxster','Cayman'], hex: ['#a8aaad','#6e7073'], historical: 'The most common metallic grey of the 997 era. Ubiquitous on dealer lots.' },
  { slug: 'black', name: 'Black', code: 'A1', family: 'Black', availability: '1950–present', generations: ['356','911 G-Series','964','993','996','997','991','992'], rarityCategory: 'Common', rarityScore: 5, models: ['911','Boxster','Cayman','Panamera','Cayenne','Macan','Taycan'], hex: ['#1a1a1a','#000000'], historical: 'The evergreen color. Common but always sharp.' },
  { slug: 'basalt-black', name: 'Basalt Black Metallic', code: 'A1A', family: 'Black', availability: '2003–present', generations: ['997','991','992','987','981','982'], rarityCategory: 'Common', rarityScore: 5, models: ['911','Boxster','Cayman'], hex: ['#222226','#0d0d10'], historical: 'Porsche\'s metallic black — the refined alternative to solid black.' },
  { slug: 'aubergine', name: 'Aubergine', code: 'PTS', family: 'Purple', availability: 'Paint to Sample', generations: ['992','982'], rarityCategory: 'Ultra Rare', rarityScore: 100, models: ['911','718'], hex: ['#4b2e5a','#2a1833'], historical: 'A deep eggplant purple only available as PTS. Extremely polarizing and collectible.' },
  { slug: 'amethyst', name: 'Amethyst Metallic', code: 'PTS', family: 'Purple', availability: 'Paint to Sample', generations: ['991','992'], rarityCategory: 'Ultra Rare', rarityScore: 100, models: ['911'], hex: ['#7b5ea7','#4a3166'], historical: 'A shimmering violet PTS that draws from the 1970s lavender palette.' },
  { slug: 'vesuvio', name: 'Vesuvio', code: 'PTS', family: 'Brown', availability: 'Paint to Sample', generations: ['992'], rarityCategory: 'Ultra Rare', rarityScore: 100, models: ['911'], hex: ['#6b3a2a','#3d2018'], historical: 'An earthy volcanic brown PTS inspired by classic Italian coachbuilding.' },
  { slug: 'mint-green', name: 'Mint Green', code: 'PTS', family: 'Green', availability: 'Paint to Sample', generations: ['992','982'], rarityCategory: 'Legendary', rarityScore: 250, models: ['911','718'], hex: ['#9fe2bf','#5cb89e'], historical: 'An ultra-rare throwback mint, almost identical to the 1970s shade. Almost never seen.' },
  { slug: 'nardo-grey', name: 'Nardo Grey', code: 'M9A', family: 'Grey', availability: '2019–present', generations: ['992','982'], rarityCategory: 'Uncommon', rarityScore: 15, models: ['911','718'], hex: ['#9b9ea4','#6c6f74'], historical: 'A flat mid-grey borrowed from Audi\'s palette and adopted by Porsche. Subtle and surgical.' },
  { slug: 'brewster-green', name: 'Brewster Green', code: 'PTS', family: 'Green', availability: 'Paint to Sample', generations: ['997','991','992'], rarityCategory: 'Legendary', rarityScore: 250, models: ['911'], hex: ['#2d5a1b','#163010'], historical: 'One of the most desirable PTS greens. Inspired by British racing heritage.' },
  { slug: 'gentian-blue', name: 'Gentian Blue Metallic', code: 'M5Q', family: 'Blue', availability: '2014–2019', generations: ['991','981'], rarityCategory: 'Rare', rarityScore: 50, models: ['911','Cayman','Boxster'], hex: ['#1b3a6b','#0e1e40'], historical: 'A deep, cool blue with a metallic shimmer — popular on the 991 GT3.' },
  { slug: 'ultraviolet', name: 'Ultraviolet', code: 'M5A', family: 'Purple', availability: '2018–2022', generations: ['991.2','992'], rarityCategory: 'Rare', rarityScore: 50, models: ['911'], hex: ['#6600cc','#3d007a'], historical: 'A vivid solid violet introduced for the 25th anniversary of the 993. Bold and rare.' },
  { slug: 'acid-green', name: 'Acid Green', code: 'L31C', family: 'Green', availability: '1972–1975', generations: ['911 G-Series'], rarityCategory: 'Legendary', rarityScore: 250, models: ['911'], hex: ['#aacc00','#7a9400'], historical: 'A period lime-yellow green from the early G-series era. Almost never survives unrestored.' },
  { slug: 'burgundy', name: 'Burgundy Metallic', code: 'M8Z', family: 'Red', availability: '1994–1998', generations: ['993'], rarityCategory: 'Rare', rarityScore: 50, models: ['911'], hex: ['#6f1825','#24070d'], historical: 'A rich burgundy metallic associated with the 993 era.' },
]

export const MODELS = ['911', '718', 'Cayman', 'Boxster', 'Taycan', 'Panamera', 'Macan', 'Cayenne', 'Carrera GT', '356', '968', '928']

export const RARITY_CONFIG: Record<RarityCategory, { label: string; color: string; bg: string }> = {
  Common:      { label: 'Common',     color: '#9ca3af', bg: 'rgba(156,163,175,0.15)' },
  Uncommon:    { label: 'Uncommon',   color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  Rare:        { label: 'Rare',       color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  'Ultra Rare':{ label: 'Ultra Rare', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  Legendary:   { label: 'Legendary', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
}

export function getColorBySlug(slug: string): PorscheColor | undefined {
  return COLORS.find(c => c.slug === slug)
}

export function searchColors(query: string): PorscheColor[] {
  const q = query.toLowerCase()
  return COLORS.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    c.family.toLowerCase().includes(q)
  )
}
