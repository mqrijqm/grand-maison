// English parallel text for catalog-copy.ts (additive; the Serbian file stays the source of truth).
import type { ArticleCopy, GroupCopy } from './catalog-copy'

export const ARTICLE_COPY_EN: Record<string, ArticleCopy> = {
  'GKP-001': {
    lead: 'Standard type A GKB board for lining walls and ceilings in dry rooms.',
    body: [
      'A 2000 × 1250 × 12.5 mm board covers 2.5 m². It is fixed to a suitable profile frame, and the joints are finished with jointing compound.',
      'Before installing, check that the room and the frame are dry and that the profiles are set flat. For stud spacing, screws and joint finishing, follow the manufacturer’s datasheet.',
    ],
    uses: ['Partition walls in dry rooms', 'Suspended ceilings', 'Lining of interior walls'],
    together: ['Galvanised wall stud CW 75', 'Galvanised track UW 75', 'Plaster joint filler'],
    tip: 'Store boards lying flat, protected from moisture and supported over their whole surface.',
  },
  'GKP-002': {
    lead: 'Moisture-resistant type H2 GKBI board, intended for rooms with occasionally raised humidity.',
    body: [
      'The green card makes the board easy to recognise, but it is not a substitute for waterproofing and does not make the wall watertight. The board is fixed to a frame, and the surface and joint finish are chosen to suit the system and the room conditions.',
      'In a bathroom, match the lining to the expected water exposure zone. Where waterproofing is required, install it according to the system manufacturer’s datasheet.',
    ],
    uses: ['Bathrooms', 'Kitchens', 'Laundry rooms', 'Partition walls in damper rooms'],
    together: ['Galvanised wall stud CW 75', 'Galvanised track UW 75', 'Plaster joint filler'],
    tip: 'Keep boards dry and protect cut edges from getting wet before installation.',
  },
  'GKP-003': {
    lead: 'Type F GKF board has a glass-fibre reinforced core and is used in linings where the design calls for a fire-rated plasterboard.',
    body: [
      'The board measures 2000 × 1250 × 12.5 mm and covers 2.5 m². The result depends on the complete construction, including the number of layers, profiles, fixings and joint finishing.',
      'The red card is for identification only and does not by itself determine the fire resistance of the finished partition. Match the lining build-up to the design and the manufacturer’s datasheet.',
    ],
    uses: ['Linings specified by the design for fire protection', 'Partition walls', 'Suspended ceilings', 'Lining of structures as per the design'],
    together: ['Galvanised wall stud CW 75', 'Galvanised track UW 75', 'Plaster joint filler'],
    tip: 'Before ordering, check the number of layers and the board type the design specifies for each side of the structure.',
  },
  'GKP-004': {
    lead: 'Hard plasterboard, 12.5 mm thick, for linings that need increased strength and impact resistance.',
    body: [
      'The 2000 × 1250 mm board covers 2.5 m². It is used on walls and other surfaces exposed to frequent contact, with a frame and fixing method that suit the system.',
      'The board’s higher strength does not replace choosing the right construction or fixing it properly. For the acoustic and fire requirements of the whole assembly, check the manufacturer’s datasheet.',
    ],
    uses: ['Walls in high-traffic areas', 'Interior linings exposed to impact', 'Partitions in commercial premises'],
    together: ['Galvanised wall stud CW 75', 'Galvanised track UW 75', 'Plaster joint filler'],
    tip: 'When cutting, support the board close to the cut line to reduce the risk of damaging the edge.',
  },
  'PRF-075': {
    lead: 'Galvanised CW 75 is a vertical profile for the frame of partition walls.',
    body: [
      'The profile is 3000 mm long, 75 mm wide and made of 0.6 mm sheet. It sits in the UW tracks, and the 75 mm width is used in wall constructions of the matching thickness.',
      'Stud spacing and fixing depend on the wall height, the lining and the system requirements. Check the design and the manufacturer’s datasheet before assembling the frame.',
    ],
    uses: ['Frames of partition walls', 'Wall lining on a frame', 'Interior drywall partitions'],
    together: ['Galvanised track UW 75', 'Plasterboard GKB 12.5 mm', 'Stone wool slab 50 mm'],
    tip: 'Profiles can be cut to length; plan the lengths so that waste is as small as possible.',
  },
  'PRF-UW75': {
    lead: 'Galvanised UW 75 is the track that guides and receives the CW studs in a partition wall.',
    body: [
      'The profile is 4000 mm long, 75 mm wide and made of 0.6 mm sheet. It is usually fixed to the floor and the ceiling, with suitable substrate preparation.',
      'Before installing, mark the line of the wall and check the position of openings. Where it meets the substrate, use the fixing details specified by the system and the manufacturer’s datasheet.',
    ],
    uses: ['Bottom track of a partition wall', 'Top track of a partition wall', 'Constructions with CW 75 profiles'],
    together: ['Galvanised wall stud CW 75', 'Plasterboard GKB 12.5 mm', 'Fibreglass jointing tape'],
    tip: 'Before fixing, transfer the same wall axis to the floor and the ceiling.',
  },
  'PRF-CD60': {
    lead: 'CD 60/27 is the main carrying and fixing profile for the frames of suspended ceilings and linings.',
    body: [
      'The profile is 4000 mm long, 60 × 27 mm and made of 0.6 mm sheet. The layout of profiles and how they are connected are set by the chosen ceiling system.',
      'Level the frame before fixing the boards. The type and spacing of hangers, as well as the profile joint details, should follow the manufacturer’s datasheet.',
    ],
    uses: ['Suspended ceilings', 'Frames for interior linings', 'Drywall constructions made of plasterboard'],
    together: ['Galvanised perimeter profile UD 28/27', 'Direct hanger for CD profile 120 mm', 'Plasterboard GKB 12.5 mm'],
    tip: 'Check the available ceiling height and the route of services before deciding the height of the frame.',
  },
  'PRF-UD28': {
    lead: 'UD 28/27 is the perimeter profile that sets the edge of a suspended ceiling frame against the wall.',
    body: [
      'The profile is 3000 mm long and 28 × 27 mm. Along the wall it receives the edges of the frame, while the CD profiles form the main part of the substructure.',
      'Set the position of the profile according to the designed ceiling height and the level of the final lining. For the choice of fixings and the spacing of supports, follow the system instructions.',
    ],
    uses: ['Perimeter of suspended ceilings', 'Edge lines of the ceiling frame', 'Interior linings on a frame'],
    together: ['Galvanised ceiling profile CD 60/27', 'Direct hanger for CD profile 120 mm', 'Plasterboard GKB 12.5 mm'],
    tip: 'Mark a level height line around the whole perimeter before fixing the profiles.',
  },
  'ISO-001': {
    lead: '50 mm stone wool slab for thermal and acoustic insulation, classed as non-combustible insulation.',
    body: [
      'The slab measures 1000 × 600 mm and is used as an insulation layer according to the intended construction. In a partition wall it is fitted between the studs, trimmed to the width of the cavity.',
      'Cut the insulation so that it fills the intended space without gaps and without unnecessary compression. For thickness and installation details, check the design and the manufacturer’s datasheet.',
    ],
    uses: ['Filling partition walls', 'Acoustic insulation of interior constructions', 'Thermal insulation of wall assemblies'],
    together: ['Galvanised wall stud CW 75', 'Galvanised track UW 75', 'Plasterboard GKB 12.5 mm'],
    tip: 'When cutting, wear eye and respiratory protection and stack the slabs so that they stay dry.',
  },
  'ISO-002': {
    lead: '100 mm stone wool slab for thermal and acoustic insulation of walls and attics.',
    body: [
      'The slab measures 1000 × 600 mm. Stone wool is non-combustible and helps absorb sound; how it is installed depends on the construction it goes into.',
      'Install the slabs without open joints and without compression that changes the intended layer. Determine the required thickness and build-up from the design and the manufacturer’s datasheet.',
    ],
    uses: ['Thermal insulation of walls', 'Attic insulation', 'Filling partition constructions'],
    together: ['Galvanised wall stud CW 75', 'Plasterboard GKB 12.5 mm', 'Fibreglass jointing tape'],
    tip: 'To calculate the quantity, take the area to be insulated and add an allowance for cutting according to the frame layout.',
  },
  'CHM-001': {
    lead: 'A 5 kg bag of plaster compound for filling plasterboard joints according to the intended finishing system.',
    body: [
      'It is used for finishing joints and local repairs, with substrate preparation and mixing as per the instructions on the pack. The product description states that it is used without tape.',
      'Check that the compound is intended for the specific joint type and final finish. Determine working time, preparation and the number of coats from the manufacturer’s datasheet.',
    ],
    uses: ['Filling plasterboard joints', 'Local repairs of plasterboard linings', 'Final finishing of drywall work'],
    together: ['Plasterboard GKB 12.5 mm', 'Moisture-resistant plasterboard GKBI 12.5 mm', 'Galvanised wall stud CW 75'],
    tip: 'Mix only as much as you can apply within the time stated on the pack.',
  },
  'CHM-002': {
    lead: 'A 25 kg bag of plaster joint filler, intended for finishing joints together with jointing tape.',
    body: [
      'The filler is used to fill the joints between plasterboards and to prepare the surface within a drywall system. The substrate and board edges must be prepared before application.',
      'Press the tape into the fresh compound and finish the joint as per the manufacturer’s instructions. Consumption, working time and the number of coats depend on the product and the joint.',
    ],
    uses: ['Jointing plasterboards', 'Finishing joints with jointing tape', 'Final finishing of partitions and ceilings'],
    together: ['Fibreglass jointing tape', 'Plasterboard GKB 12.5 mm', 'Moisture-resistant plasterboard GKBI 12.5 mm'],
    tip: 'Keep bags on a pallet in a dry room and use them before the expiry date printed on the pack.',
  },
  'ACC-003': {
    lead: 'Self-adhesive fibreglass jointing tape in a 25 m roll, for reinforcing plasterboard joints.',
    body: [
      'The tape is stuck over the prepared joint and then finished with jointing filler according to the system. Its width and position should allow the whole joint to be finished evenly.',
      'Check that the surface is clean and dry before sticking. At joints and corners, use the solution that suits the detail and the manufacturer’s instructions.',
    ],
    uses: ['Plasterboard joints', 'Finishing partitions', 'Finishing ceiling linings'],
    together: ['Plaster joint filler', 'Plasterboard GKB 12.5 mm', 'Moisture-resistant plasterboard GKBI 12.5 mm'],
    tip: 'Measure the tape before sticking and press it on flat, with no creases and without skipping the joint.',
  },
  'ACC-006': {
    lead: 'A 120 mm direct hanger for fixing CD 60/27 profiles in a ceiling frame.',
    body: [
      'The pack contains 100 pieces. The hanger is fixed to the substrate and connects the CD profile to the structure according to the chosen suspended ceiling system.',
      'The hanger length is chosen according to the required drop and the construction details. Determine the spacing, the type of fixing and how the profiles are connected from the design and the manufacturer’s datasheet.',
    ],
    uses: ['Suspended ceilings on CD profiles', 'Installing the ceiling frame', 'Adjusting the position of CD profiles'],
    together: ['Galvanised ceiling profile CD 60/27', 'Galvanised perimeter profile UD 28/27', 'Plasterboard GKB 12.5 mm'],
    tip: 'Before ordering, count the hangers against the profile layout in the room and check the substrate for fixing.',
  },
}

export const GROUP_COPY_EN: Record<string, GroupCopy> = {
  'suha-gradnja': {
    kicker: '01 · Boards, profiles, accessories',
    title: 'Drywall systems',
    intro: [
      'Boards and profiles are used for interior partitions, linings and suspended ceilings. Contractors first choose the board type to suit the room and the design requirement, then the profile width to suit the construction.',
      'GKB is the standard type A board, GKBI is the moisture-resistant type H2 board, and GKF is the type F board with a glass-fibre reinforced core. Use CW and UW profiles for partition walls and CD and UD for ceiling frames; set spacing and build-up according to the manufacturer’s datasheet.',
    ],
    facts: [
      ['For work on', 'Partition walls, ceilings and interior linings'],
      ['Choosing a board', 'By the use of the room and the design requirement'],
      ['Check', 'Build-up of the construction, stud spacing and joint finishing'],
    ],
  },
  izolacija: {
    kicker: '02 · Wool and facade boards',
    title: 'Insulation and facades',
    intro: [
      'The group covers stone and glass wool, white EPS 70 and graphite EPS for different assemblies. The choice starts with the application: wall, attic, pitched roof or contact facade.',
      'Stone wool is non-combustible and absorbs sound, while roll glass wool is practical to lay in roof cavities. EPS is used in contact facades; the graphite board has a declared λ = 0.031 W/mK, and the thickness and layers should be matched to the design and the datasheets.',
    ],
    facts: [
      ['For work on', 'Walls, attics, pitched roofs and facades'],
      ['Facade system', 'Adhesive, board, base coat with mesh, primer and render'],
      ['Check', 'The substrate, the layers of the construction and the required thickness'],
    ],
  },
  veziva: {
    kicker: '03 · Compounds and facade adhesives',
    title: 'Binders and compounds',
    intro: [
      'Here you will find compounds for plasterboard joints and adhesives for facade insulation boards. Choose the compound according to whether the joint is finished with tape or you are bonding and reinforcing a facade.',
      'For ETICS work, plan the components as a matched system: adhesive, insulation board, base coat with mesh, primer and finishing render. Check preparation, consumption and application conditions in the datasheet of the specific product.',
    ],
    facts: [
      ['For work on', 'Board jointing and facade insulation systems'],
      ['For joints', 'The matching compound and jointing tape for the system'],
      ['Storage', 'Keep bags on a pallet in a dry room'],
    ],
  },
  oprema: {
    kicker: '04 · Tapes and fixings',
    title: 'Installation accessories',
    intro: [
      'Accessories go with the installation of drywall walls and ceilings. Jointing tape reinforces board joints, and the direct hanger connects the CD profile to the substrate in a ceiling frame.',
      'Work out quantities from the layout of boards and profiles and from the design. For fixings and hanger spacing, rely on the system datasheet.',
    ],
    facts: [
      ['For work on', 'Joint finishing and installing the ceiling frame'],
      ['Accessories', 'Jointing tape and direct hangers for CD profiles'],
      ['Check', 'The layout of profiles and the quantity per room'],
    ],
  },
  'zidni-krovni': {
    kicker: '05 · Masonry and roofing',
    title: 'Wall and roof range',
    intro: [
      'The range covers masonry and roofing items that are ordered on enquiry. The choice of element depends on the design, the dimensions of the wall or roof and the joint details.',
      'Before ordering, agree dimensions, the required quantity and the method of delivery with sales. Specifications and availability are confirmed by sales.',
    ],
    facts: [
      ['For work on', 'Masonry, lintels and roof coverings'],
      ['Choice', 'By the design and the dimensions of the structure'],
      ['Ordering', 'On enquiry; availability confirmed by sales'],
    ],
  },
  'drvni-program': {
    kicker: '06 · Timber and board materials',
    title: 'Timber range',
    intro: [
      'The timber range brings together sawn timber, roof structure elements and board materials for building and finishing work. The choice depends on the use of the element and the dimensions in the design.',
      'Before ordering, establish the required lengths, cross-sections and quantity. Specifications and availability are confirmed by sales.',
    ],
    facts: [
      ['For work on', 'Roof structures, linings and floors'],
      ['Choice', 'By use and the dimensions in the design'],
      ['Ordering', 'On enquiry; availability confirmed by sales'],
    ],
  },
  'sanitarna-oprema': {
    kicker: '07 · Bathroom equipment',
    title: 'Sanitaryware',
    intro: [
      'Sanitaryware covers the basic elements for fitting out a bathroom. When choosing, match the product dimensions, the position of connections and the layout of the room.',
      'Before the installations are finished, check the dimensions and the installation method of the chosen item. Specifications and availability are confirmed by sales.',
    ],
    facts: [
      ['For work on', 'Bathroom equipment and fit-out'],
      ['Choice', 'By the room and the position of connections'],
      ['Ordering', 'On enquiry; availability confirmed by sales'],
    ],
  },
}

export const PROGRAM_ITEMS_EN: Record<string, { name?: string; spec: string; lead: string; uses: string[] }> = {
  'porotherm-25-s': { spec: '375 × 250 × 238 mm · 10.50 pcs/m² · 15.10 kg/pc', lead: 'Clay block for load-bearing walls, with a mortar pocket, laid with mortar.', uses: ['Load-bearing walls'] },
  'porotherm-25-profi': { spec: '375 × 250 × 249 mm · 10.50 pcs/m² · 17.60 kg/pc', lead: 'Ground clay block laid with Dryfix.extra adhesive.', uses: ['Load-bearing walls'] },
  'porotherm-30-profi': { spec: '250 × 300 × 249 mm · 16 pcs/m² · 14.60 kg/pc', lead: 'Ground clay block for a 30 cm thick wall.', uses: ['Load-bearing walls'] },
  'porotherm-38-izo-profi': { spec: '250 × 380 × 249 mm · 16 pcs/m² · 14.70 kg/pc', lead: 'Ground clay block filled with stone wool, for an energy-efficient external wall.', uses: ['External walls'] },
  'porotherm-50-izo-profi': { spec: '250 × 500 × 249 mm · 16 pcs/m² · 19.30 kg/pc', lead: 'Ground clay block with stone wool, for a 50 cm thick wall.', uses: ['External walls'] },
  'porotherm-20': { spec: '375 × 200 × 238 mm · 8 pcs/m² · 11.90 kg/pc', lead: 'Clay block for a 20 cm thick wall.', uses: ['Walls'] },
  'porotherm-15': { spec: '500 × 150 × 238 mm · 12.05 kg/pc', lead: 'Partition clay block, 15 cm thick.', uses: ['Partition walls'] },
  'porotherm-10-s': { spec: '500 × 100 × 238 mm · 8 pcs/m² · 8.10 kg/pc', lead: 'Partition clay block, 10 cm thick.', uses: ['Partition walls'] },
  'tondach-continental-12': { spec: '27.2 × 44.5 cm · 12.0–15.5 pcs/m² · 3.00 kg/pc', lead: 'Clay roof tile with a modern look; standard roof pitch 27°.', uses: ['Pitched roofs'] },
  'tondach-traditon-9': { spec: '29 × 48.5 cm · 9.5–10.5 pcs/m² · 4.08 kg/pc', lead: 'Large-format tile with two deep grooves; standard pitch 27°.', uses: ['Pitched roofs'] },
  'tondach-twiston-9': { spec: '30 × 50 cm · 9 pcs/m² · 3.50 kg/pc', lead: 'Large-format tile for any architecture; standard pitch 25°.', uses: ['Pitched roofs'] },
  'tondach-planoton-10': { spec: '29 × 48.5 cm · 10.0–11.0 pcs/m² · 3.84 kg/pc', lead: 'Flat modern tile; standard pitch 35°.', uses: ['Pitched roofs'] },
  'tondach-contiton-9': { spec: '29 × 48.5 cm · 9.6–10.6 pcs/m² · 4.0 kg/pc', lead: 'Large-format tile; standard pitch 17°.', uses: ['Pitched roofs'] },
  'tondach-veneton-13': { spec: '27.5 × 44.0 cm · 13.6–14.4 pcs/m² · 3.20 kg/pc', lead: 'Mediterranean wave-profile tile; standard pitch 30°.', uses: ['Pitched roofs'] },
  'tondach-biber': { spec: '19 × 40 cm · 30.40 pcs/m² · 1.9 kg/pc', lead: 'Traditional flat tile.', uses: ['Pitched roofs'] },
  'tondach-fol-s-145': { name: 'Vapour-permeable membrane FOL S 145 g/m²', spec: '145 g/m²', lead: 'System roofing accessory: a vapour-permeable membrane under the roof covering.', uses: ['Roofing accessories'] },
  'baumalt-ck-12': { spec: 'Cement-lime plaster 1.2 mm · approx. 14 kg/m²/cm', lead: 'For machine and hand rendering, indoors and outdoors.', uses: ['Rendering'] },
  'baumalt-ck-20': { spec: 'Cement-lime plaster 2.0 mm · approx. 16 kg/m²/cm', lead: 'Cement-lime machine-applied plaster.', uses: ['Rendering'] },
  'baumalt-gk-12': { spec: 'Gypsum-lime plaster, smooth finish 1.2 mm · 11.0 kg/m²/cm', lead: 'For interior walls, by machine or by hand.', uses: ['Rendering'] },
  'baumalt-cs-20': { name: 'Baumalt CS 20 cement splatter coat', spec: 'Approx. 6–8 kg/m²', lead: 'Bonding layer before rendering.', uses: ['Rendering'] },
  'baumalt-bmcolle-f': { spec: 'Flexible tile adhesive · 3.0–4.0 kg/m²', lead: 'For indoor and outdoor work, waterproof.', uses: ['Tiling'] },
  'baumalt-bmcolle-s': { spec: 'Improved tile adhesive · 3.0–4.0 kg/m²', lead: 'For indoor work.', uses: ['Tiling'] },
  'baumalt-bmcolle-f-premium': { spec: 'Flexible fibre-reinforced adhesive, reduced slip (EN 12004)', lead: 'For ceramic, stone and underfloor heating.', uses: ['Tiling'] },
  'baumalt-bmcolle-u': { spec: 'Bonding 3.0–4.0 kg/m² · reinforcing approx. 4.0 kg/m²', lead: 'Universal adhesive for bonding and reinforcing EPS (thermal facade).', uses: ['Facade'] },
  'baumalt-bmedelputz-f15': { spec: 'Rubbed texture 1.5 mm · 3.0–4.0 kg/m²', lead: 'Textured decorative render for indoors and outdoors.', uses: ['Facade'] },
  'baumalt-bmedelputz-r20': { spec: 'Scratched texture 2.0 mm · 3.0–4.0 kg/m²', lead: 'Textured decorative render.', uses: ['Facade'] },
}
