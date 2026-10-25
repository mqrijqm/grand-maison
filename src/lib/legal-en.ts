// English edition of the legal and service pages. Same slugs, section ids and block structure as legal.ts
// (the Serbian text there is the source of truth); placeholders such as {naziv} or {email} are unchanged
// and are filled in from company.ts. Page titles referenced in quotes must match the titles below.

import type { Lang } from './i18n'
import type { LegalDoc, LegalGroup } from './legal-types'
import { LEGAL_DOCS } from './legal'

const UPDATED = '24 September 2026'

export const GROUP_LABEL_EN: Record<LegalGroup, string> = {
  kupovina: 'Shopping',
  pravno: 'Legal',
  usluge: 'Services',
}

export const LEGAL_DOCS_EN: LegalDoc[] = [
  // ───────────────────────────── 1. DELIVERY ─────────────────────────────
  {
    slug: 'dostava',
    title: 'Delivery',
    group: 'kupovina',
    kicker: 'Shipping',
    lead: 'Collect in person or send a delivery enquiry. Check the possibility of delivery, the lead time, the cost and the unloading arrangements with our sales team, based on the goods and the location.',
    updated: UPDATED,
    sections: [
      {
        id: 'kako-do-robe',
        title: 'Getting your goods: collection, delivery and unloading',
        blocks: [
          {
            t: 'ol',
            items: [
              'Collection in person: our yard is in Banja Luka. Before you come, check that the goods are available and arrange the pick-up.',
              'Delivery to an address: send the address and a description of the materials. Sales will check whether delivery is possible, and confirm the date and the delivery cost.',
              'Access and unloading: tell us what the approach to the site is like and where the goods should be placed. The unloading method is agreed according to the goods and the conditions on site.',
            ],
          },
        ],
      },
      {
        id: 'sta-poslati',
        title: 'What to send us for a delivery enquiry',
        blocks: [
          {
            t: 'ul',
            items: [
              'the material and quantity;',
              'the delivery address, or a note that you will collect the goods in person;',
              'your preferred date;',
              'the access and unloading conditions.',
            ],
          },
          {
            t: 'p',
            text: 'Send your enquiry through the “Enquiry for Contractors and Projects” page or directly to sales on {telefon}.',
          },
        ],
      },
      {
        id: 'prije-narucivanja',
        title: 'Before you order',
        blocks: [
          {
            t: 'ul',
            items: [
              'Preparing your enquiry: state the material, specification, quantity and unit of measure. Attach a bill of quantities if you have one.',
              'Choosing materials: guides to choosing boards, insulation and materials for the different stages of works are on the “Guides” page.',
              'Technical documentation: send us the name or code of the product for which you need a technical data sheet, installation instructions or a declaration of performance.',
            ],
          },
        ],
      },
      {
        id: 'podrucje-i-rok',
        title: 'Delivery area and lead time',
        blocks: [
          {
            t: 'p',
            text: 'We deliver within the territory of the city of Banja Luka. Send the address and a description of the goods; sales will tell you the price and date of delivery before the order is confirmed.',
          },
          {
            t: 'p',
            text: 'The delivery lead time is not fixed in advance: we agree it when we confirm the order, depending on the availability of the items, the size of the order and the distance.',
          },
          {
            t: 'p',
            text: 'If you pay in advance against a proforma invoice, we dispatch the goods once we have recorded your payment. If an item is not available, we will let you know and agree a new date before delivery.',
          },
        ],
      },
      {
        id: 'troskovi',
        title: 'Delivery costs',
        blocks: [
          {
            t: 'p',
            text: 'The delivery cost depends on the location, the quantity and the type of goods. We do not publish a delivery price list; we state the exact amount before the order is confirmed, so you know it before you commit to paying.',
          },
          {
            t: 'p',
            text: 'For goods that require a special vehicle, several trips or an additional service (for example unloading with machinery), we set the cost individually and state it in the order confirmation or the quotation.',
          },
        ],
      },
      {
        id: 'teska-roba-i-istovar',
        title: 'Heavy goods, pallet delivery and unloading',
        blocks: [
          {
            t: 'p',
            text: 'Boards, profiles, stone wool and similar goods are often delivered on pallets or in larger quantities. We agree the delivery method, the type of vehicle and the date with you in advance, usually by phone or email.',
          },
          {
            t: 'p',
            text: 'Before the order is confirmed, agree on clear vehicle access to the unloading point and on who provides the people or equipment for unloading. If unloading has been specifically agreed and stated in the quotation, those agreed terms apply.',
          },
          {
            t: 'p',
            text: 'Unloading onto a floor or scaffold is not a standard part of delivery. If you need it, we agree the vehicle and the unloading method in advance. The terms depend on the location, the access and the type of goods, and we state the price in the quotation or the order confirmation.',
          },
          { t: 'p', text: 'Before delivery, please tell us:' },
          {
            t: 'ul',
            items: [
              'the exact address and any access restrictions (narrow street, limited height or load capacity, unpaved approach);',
              'where the goods can be placed after unloading;',
              'a contact person who will be available by phone at the agreed time.',
            ],
          },
        ],
      },
      {
        id: 'preuzimanje-i-provjera',
        title: 'Receiving and checking the goods',
        blocks: [
          {
            t: 'p',
            text: 'When you receive the goods, check that the delivery is complete and in good condition.',
          },
          {
            t: 'ol',
            items: [
              'Compare the number of packages or pallets and items with the delivery note.',
              'Inspect the packaging and the visible condition of the goods before signing.',
              'Write any visible damage or shortage on the delivery note or proof of delivery, and photograph it.',
              'Notify us without delay, quoting the order number.',
            ],
          },
          {
            t: 'p',
            text: 'Defects that could not be noticed on receipt are handled under the procedure described on the “Warranty and Complaints” page.',
          },
          {
            t: 'note',
            text: 'Your signature on the delivery note confirms receipt of the consignment, so write the note about damage before you sign.',
          },
        ],
      },
      {
        id: 'licno-preuzimanje',
        title: 'Collection in person',
        blocks: [
          {
            t: 'p',
            text: 'You can collect your order in person at {sjediste} once we have told you it is ready. Arrange the collection time with us, and bring your order number and a personal ID document.',
          },
          {
            t: 'p',
            text: 'For larger quantities of goods, arrange loading and a vehicle of suitable capacity in advance.',
          },
        ],
      },
      {
        id: 'nema-nikoga-na-adresi',
        title: 'If nobody is at the address',
        blocks: [
          {
            t: 'p',
            text: 'If nobody is there to receive the goods at the agreed time, the driver will try to contact you by phone. We agree a new delivery date with you.',
          },
          {
            t: 'p',
            text: 'If delivery fails for reasons on your side, we may charge for the repeat delivery, and we will tell you beforehand. If delivery fails again at the newly agreed time, the order may be cancelled, and we refund the amount paid as described on the “Refunds” page.',
          },
        ],
      },
      {
        id: 'gradilista',
        title: 'Delivery to a construction site',
        blocks: [
          {
            t: 'p',
            text: 'For contractors, we agree delivery to the construction site individually: the location, the dates, delivery in stages of the works and the unloading method. For larger projects, see the “Enquiry for Contractors and Projects” page.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 2. RETURNS ─────────────────────────────
  {
    slug: 'povrat-robe',
    title: 'Returns',
    group: 'kupovina',
    kicker: 'Returns',
    lead: 'You can return goods in accordance with consumer protection regulations and the conditions set out here. Please contact us before you send the goods back, so that the return goes smoothly.',
    updated: UPDATED,
    sections: [
      {
        id: 'kako-vratiti',
        title: 'How to return goods',
        blocks: [
          {
            t: 'ol',
            items: [
              'Contact us by email ({email}) or phone ({telefon}) and state the order number and the items you are returning.',
              'Wait for our confirmation and agree how the goods will be returned, especially if they are heavy or palletised.',
              'Pack the goods in the original packaging, with accessories and the accompanying documents, or in packaging that protects them in transit.',
              'Send or bring the goods back within the agreed time.',
              'Once we receive them, we inspect the goods and let you know the outcome.',
            ],
          },
          {
            t: 'p',
            text: 'If you are returning goods because you are withdrawing from the contract, the rules, deadlines and the model form are on the “Right of Withdrawal” page. This page describes the practical side of returning goods.',
          },
        ],
      },
      {
        id: 'stanje-robe',
        title: 'The condition the goods must be in',
        blocks: [
          {
            t: 'ul',
            items: [
              'undamaged and unused, in the condition in which you received them;',
              'complete, with accessories, instructions and the warranty card (if there was one);',
              'preferably in the original, undamaged packaging.',
            ],
          },
          {
            t: 'p',
            text: 'The law allows you to examine the goods to the extent necessary to establish their nature and how they work. If the value of the goods has been reduced because they were handled in any other way, the refund amount may be reduced in proportion to that reduction.',
          },
        ],
      },
      {
        id: 'izuzeci',
        title: 'Goods that cannot be returned',
        blocks: [
          {
            t: 'p',
            text: 'Because of the nature of building materials, returns are not possible or are limited for:',
          },
          {
            t: 'ul',
            items: [
              'goods that have been mixed, cut or ordered specially to the customer’s specification;',
              'goods that have been installed or processed so that they cannot be returned in their original condition;',
              'opened bags of binders (compounds, adhesives, cement) and bags that have been stored in damp conditions;',
              'damaged or used goods whose value has been reduced beyond what is needed for inspection.',
            ],
          },
          {
            t: 'p',
            text: 'These limitations do not reduce your rights when the goods are defective. For that, see the “Warranty and Complaints” page.',
          },
        ],
      },
      {
        id: 'prevoz-i-troskovi',
        title: 'Transport and return costs',
        blocks: [
          {
            t: 'p',
            text: 'The consumer bears the cost of returning the goods, unless the seller has stated otherwise. If you are returning goods because we delivered the wrong item or because it is defective, we bear the return costs.',
          },
          {
            t: 'p',
            text: 'For heavy and palletised goods, transport is agreed in advance. Please do not send such goods without agreeing with us first: the costs can be considerable, and improper packing increases the risk of damage in transit. Protect the goods so that they reach us undamaged.',
          },
        ],
      },
      {
        id: 'pregled-pri-prijemu',
        title: 'Inspection on receipt',
        blocks: [
          {
            t: 'p',
            text: 'On receipt, we check whether the returned goods match the order, whether they are complete and in what condition they are. We let you know the result. If the goods are not in the condition a return requires, we will tell you the reasons and agree the next steps, including a possible reduction of the refund amount.',
          },
          {
            t: 'p',
            text: 'When a return is accepted, we refund your money as described on the “Refunds” page.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 3. REFUNDS ─────────────────────────────
  {
    slug: 'povrat-novca',
    title: 'Refunds',
    group: 'kupovina',
    kicker: 'Money',
    lead: 'We refund your money using the same payment method with which the order was paid, without undue delay and within the period prescribed by law.',
    updated: UPDATED,
    sections: [
      {
        id: 'kada-i-kako',
        title: 'When and how we refund your money',
        blocks: [
          {
            t: 'p',
            text: 'We refund the amount using the same payment method you used for the purchase, unless we expressly agree otherwise, and at no additional cost to you.',
          },
          {
            t: 'p',
            text: 'When you withdraw from the contract, we make the refund without undue delay and no later than {rokOdustanka} from the day we received your statement of withdrawal. If the goods have not yet been returned, we may postpone the refund until we receive the goods or until you prove that you have sent them.',
          },
          {
            t: 'p',
            text: 'When the contract is terminated because of a defect in the goods, we make the refund within the period prescribed by law.',
          },
        ],
      },
      {
        id: 'prema-nacinu-placanja',
        title: 'Refund by payment method',
        blocks: [
          {
            t: 'dl',
            items: [
              {
                k: 'Cash on delivery',
                v: 'We refund the amount to a bank account that you give us or, by agreement, in cash on collection at {sjediste}.',
              },
              {
                k: 'Bank transfer against a proforma invoice',
                v: 'We refund the amount to the account from which the payment was made or to an account that you give us in writing.',
              },
              {
                k: 'By card (once activated)',
                v: 'Once card payment is activated, we refund the amount to the same card through the payment processor. How long it takes to appear on your card account depends on the card issuer’s bank and may be longer than our processing time.',
              },
            ],
          },
        ],
      },
      {
        id: 'troskovi-dostave',
        title: 'Refund of delivery costs',
        blocks: [
          {
            t: 'p',
            text: 'When you withdraw from the contract, we also refund the cost of standard delivery that you paid when ordering. Additional costs arising because you chose a different, more expensive delivery method than the standard one are not refunded.',
          },
          {
            t: 'p',
            text: 'We are not obliged to compensate the cost of returning the goods, except in the cases stated on the “Returns” page.',
          },
        ],
      },
      {
        id: 'umanjenje-vrijednosti',
        title: 'Reduced value and partial refunds',
        blocks: [
          {
            t: 'p',
            text: 'If you return only part of an order, we refund the price of that part. If the value of the returned goods has been reduced because of handling that was not necessary to establish their nature, we reduce the refund amount in proportion to that reduction.',
          },
          {
            t: 'p',
            text: 'We notify you in writing of any reduction, with reasons, before payment.',
          },
        ],
      },
      {
        id: 'nakon-reklamacije',
        title: 'Refund after a complaint',
        blocks: [
          {
            t: 'p',
            text: 'If the contract has been terminated because of a defect in the goods (see “Warranty and Complaints”), we refund the price of the goods and we bear the cost of returning them.',
          },
        ],
      },
      {
        id: 'ako-novac-kasni',
        title: 'If your money is late',
        blocks: [
          {
            t: 'p',
            text: 'If you have not received your money within the expected time, check with your bank, as posting can take a while. If the money still has not arrived, contact us at {email} or {telefon} and state the order number.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 4. PAYMENT METHODS ─────────────────────────────
  {
    slug: 'nacini-placanja',
    title: 'Payment Methods',
    group: 'kupovina',
    kicker: 'Payment',
    lead: 'You receive the price in a quotation, in KM including VAT. At the moment you can pay in cash on delivery or by bank transfer against a proforma invoice or quotation; card payment through the website will be available once it is activated.',
    updated: UPDATED,
    sections: [
      {
        id: 'dostupni-nacini',
        title: 'Available payment methods',
        blocks: [
          {
            t: 'ul',
            items: [
              'cash on delivery or on collection;',
              'bank transfer against a proforma invoice or quotation;',
              'payment card through the website (once activated).',
            ],
          },
          {
            t: 'p',
            text: 'You choose the payment method when you order. If a method is not available for your order, we will say so before confirmation.',
          },
        ],
      },
      {
        id: 'gotovina',
        title: 'Cash on delivery',
        blocks: [
          {
            t: 'p',
            text: 'You pay the driver when you receive the goods, or at the point of sale when collecting in person. If possible, have the exact amount ready. You receive the invoice together with the goods.',
          },
        ],
      },
      {
        id: 'bankovni-prenos',
        title: 'Bank transfer against a proforma invoice or quotation',
        blocks: [
          {
            t: 'ol',
            items: [
              'After receiving your order, we send a proforma invoice or quotation with the total amount.',
              'You make the payment to the current account {racun}, stating the payment reference (the proforma invoice or order number).',
              'We dispatch the goods once we have recorded your payment, unless otherwise agreed.',
            ],
          },
        ],
      },
      {
        id: 'kartica',
        title: 'Card payment through the website',
        blocks: [
          {
            t: 'p',
            text: 'Card payment through the website is not currently active. Once it is activated, payment will be made with a payment processor, on its secure page, and this page will be updated.',
          },
        ],
      },
      {
        id: 'cijene-pdv-racun',
        title: 'Prices, VAT and invoice',
        blocks: [
          {
            t: 'p',
            text: 'All prices are stated in convertible marks (KM) and include VAT. We issue an invoice for every order. If you need the invoice issued to a legal entity, state the company name, address, JIB (tax ID) and VAT number when ordering.',
          },
        ],
      },
      {
        id: 'izvodjaci',
        title: 'Terms for contractors',
        blocks: [
          {
            t: 'p',
            text: 'For contractors and larger orders, payment terms can be agreed separately. Such an agreement is valid only if it is stated in a written quotation or contract. More on the “Enquiry for Contractors and Projects” page.',
          },
        ],
      },
      {
        id: 'sigurnost-podataka',
        title: 'Security of payment data',
        blocks: [
          {
            t: 'p',
            text: 'Once card payment is activated, you enter your card details exclusively with the payment processor. The seller does not see or store them. Never send card details by email, message or phone: we never ask for them that way.',
          },
          {
            t: 'p',
            text: 'We process the personal data you leave when ordering as described on the “Privacy Policy” page.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 5. WARRANTY AND COMPLAINTS ─────────────────────────────
  {
    slug: 'garancija-i-reklamacije',
    title: 'Warranty and Complaints',
    group: 'kupovina',
    kicker: 'Complaints',
    lead: 'The seller is liable for the conformity of the goods with the contract for the period prescribed by law, and for some products there is also a manufacturer’s warranty. You can file a complaint by email, phone or in person.',
    updated: UPDATED,
    sections: [
      {
        id: 'kako-podnijeti',
        title: 'How to file a complaint',
        blocks: [
          {
            t: 'ol',
            items: [
              'Notify us of the defect without delay once you notice it: by email ({email}), by phone ({telefon}) or in person at {sjediste}.',
              'State the order or invoice number, the product name, the quantity and a description of the defect.',
              'Attach photographs of the defect and, if available, the markings on the packaging (for example the batch number).',
              'Keep the goods and packaging until the complaint is resolved. If you noticed the defect before installation, do not install the goods until we reply.',
            ],
          },
          {
            t: 'p',
            text: 'We record and acknowledge receipt of the complaint. We reply to a complaint as soon as possible and no later than the period prescribed by law.',
          },
          {
            t: 'p',
            text: 'If necessary, we will ask for additional information or photographs and, where needed, inspect the goods. We then let you know the proposed solution and the time for carrying it out. For a justified complaint, the cost of remedying the defect, including transport of the goods in connection with the complaint, is borne by the seller.',
          },
        ],
      },
      {
        id: 'odgovornost-prodavca',
        title: 'The seller’s liability for conformity',
        blocks: [
          {
            t: 'p',
            text: 'The seller is responsible for the delivered goods conforming to the contract: its description, quantity, quality and purpose. For defects that existed at the time the risk passed to the consumer, we are liable for the period prescribed by law.',
          },
          {
            t: 'p',
            text: 'This liability exists regardless of the manufacturer’s warranty and cannot be excluded by contract to the consumer’s detriment. For buyers who are not consumers, for example contractors who buy goods for their business, the contract and the Law on Obligations (Zakon o obligacionim odnosima) apply, including the duty to report a defect without delay.',
          },
        ],
      },
      {
        id: 'garancija-proizvodjaca',
        title: 'Manufacturer’s warranty',
        blocks: [
          {
            t: 'p',
            text: 'For some products the manufacturer issues a warranty. If one has been issued, you receive a warranty card with the goods, or the warranty is stated in the product documentation. The duration, scope and manner of exercising the warranty are determined by the manufacturer.',
          },
          {
            t: 'p',
            text: 'The manufacturer’s warranty is additional and does not exclude your rights against the seller. Keep the warranty card, the invoice and the installation and use instructions. Where needed, we help you forward your claim to the manufacturer or an authorised service centre.',
          },
        ],
      },
      {
        id: 'sta-mozete-zahtijevati',
        title: 'What you can demand',
        blocks: [
          {
            t: 'ul',
            items: [
              'repair, that is, remedying the defect;',
              'replacement of the goods;',
              'a price reduction;',
              'termination of the contract and a refund.',
            ],
          },
          {
            t: 'p',
            text: 'The order and conditions for exercising these rights are set by law. In our reply to a complaint, we explain what is possible in your case. The refund after termination of the contract is described on the “Refunds” page.',
          },
          {
            t: 'p',
            text: 'For goods sold by dimension or quantity (for example boards, profiles or rolls), it is best to report a defect before cutting or installing the whole quantity.',
          },
        ],
      },
      {
        id: 'steta-pri-dostavi',
        title: 'Visible damage on delivery',
        blocks: [
          {
            t: 'p',
            text: 'If you noticed damage on receipt, write it on the delivery note and contact us straight away, with photographs of the packaging and the goods (see “Delivery”). The seller is liable for damage that occurred before you took delivery, and reporting it immediately on receipt speeds up resolution considerably.',
          },
        ],
      },
      {
        id: 'sta-nije-obuhvaceno',
        title: 'What is not covered',
        blocks: [
          { t: 'p', text: 'A complaint is not justified when the defect is the result of:' },
          {
            t: 'ul',
            items: [
              'improper storage after receipt (for example moisture, exposure to sun, unsuitable stacking of pallets);',
              'unprofessional or unsuitable installation, or use contrary to the manufacturer’s instructions;',
              'ordinary wear and ageing;',
              'damage that occurred after the risk passed to the buyer, including mechanical damage and unauthorised modification or alteration of the goods.',
            ],
          },
          {
            t: 'p',
            text: 'If we assess that a complaint is not justified, you receive a written explanation with the reasons.',
          },
        ],
      },
      {
        id: 'ako-se-ne-slazete',
        title: 'If you disagree with the reply',
        blocks: [
          {
            t: 'p',
            text: 'If you are not satisfied with the reply, you can request out-of-court dispute resolution or contact the competent consumer protection authority. More on the “Terms of Purchase” and “Seller Information” pages.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 6. ORDER STATUS ─────────────────────────────
  {
    slug: 'status-narudzbe',
    title: 'Order Status',
    group: 'kupovina',
    kicker: 'Order',
    lead: 'For now, you check the status of your order by contacting the seller, quoting the order number. Order tracking through the website will be available once it is activated.',
    updated: UPDATED,
    sections: [
      {
        id: 'provjera-statusa',
        title: 'How to check the status',
        blocks: [
          {
            t: 'p',
            text: 'Contact us by email ({email}) or phone ({telefon}) and state the order number. If you do not have it to hand, give the name and contact details you left when ordering.',
          },
          {
            t: 'p',
            text: 'Order tracking through the website and customer accounts will be available once they are activated. This page will be updated then.',
          },
          {
            t: 'p',
            text: 'When you order, you receive an order number. Keep it: it is needed for all enquiries, changes, withdrawal from the contract and complaints.',
          },
        ],
      },
      {
        id: 'faze-narudzbe',
        title: 'Order stages',
        blocks: [
          {
            t: 'ol',
            items: [
              '*Received.* The order has been received; the contract has not yet been concluded.',
              '*Confirmed.* The seller has confirmed the items, the price and the delivery terms; the contract has been concluded.',
              '*In preparation.* The goods are being prepared, packed or made ready for loading.',
              '*Delivered or collected.* The goods have been handed to the carrier or collected in person.',
              '*Closed.* The order is complete, including payment.',
            ],
          },
          {
            t: 'p',
            text: 'How long each stage lasts depends on the items, the delivery method and the payment. With payment against a proforma invoice, the order moves into preparation once we have recorded your payment.',
          },
        ],
      },
      {
        id: 'potvrda-narudzbe',
        title: 'Order confirmation',
        blocks: [
          {
            t: 'p',
            text: 'After receiving your order, we contact you by email or phone to confirm the items, the price and the delivery date. The contract is concluded only when we send you the confirmation (see “Terms of Purchase”).',
          },
          {
            t: 'p',
            text: 'If you do not receive the confirmation within a reasonable time, check your spam folder and contact us.',
          },
        ],
      },
      {
        id: 'izmjena-i-otkazivanje',
        title: 'Changing and cancelling before dispatch',
        blocks: [
          {
            t: 'p',
            text: 'You can change or cancel your order until it has been handed to the carrier. Contact us as soon as possible, quoting the order number.',
          },
          {
            t: 'p',
            text: 'If the order has already been dispatched, the rules on withdrawal from the contract and returns apply. For goods that are cut, mixed or prepared to your specification, a change or cancellation may not be possible once preparation has started.',
          },
        ],
      },
      {
        id: 'nedostupan-artikal',
        title: 'If an item is not available',
        blocks: [
          {
            t: 'p',
            text: 'If an item in your order is not available, we notify you without delay and offer the following options:',
          },
          {
            t: 'ul',
            items: [
              'wait for the item to be delivered, with a new lead time;',
              'accept a substitute item, with your consent;',
              'have us deliver the rest of the order;',
              'cancel the unavailable part, or the whole order.',
            ],
          },
          {
            t: 'p',
            text: 'If you have already paid, the refund is made as described on the “Refunds” page.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 7. TERMS OF PURCHASE ─────────────────────────────
  {
    slug: 'uslovi-kupovine',
    title: 'Terms of Purchase',
    group: 'pravno',
    kicker: 'General terms',
    lead: 'These terms govern purchases in the online shop of {naziv}. By submitting an order, you confirm that you have read and accept them.',
    updated: UPDATED,
    sections: [
      {
        id: 'prodavac-i-pojmovi',
        title: 'Seller, scope and definitions',
        blocks: [
          {
            t: 'p',
            text: 'The seller is {naziv} of Banja Luka (hereinafter: the *seller* or “we”), registered office: {sjediste}, JIB (tax ID): {jib}, VAT number: {pdv}, registration: {registracija}. The company is represented by its director, {direktor}. Full details are on the “Seller Information” page.',
          },
          {
            t: 'p',
            text: 'These terms apply to all orders for goods placed through the online shop, as well as to orders placed by phone or email, unless otherwise agreed. Special terms can be agreed in writing for contractors and larger projects; they take precedence over these terms to the extent that they differ.',
          },
          { t: 'p', text: 'In these terms:' },
          {
            t: 'ul',
            items: [
              '*buyer* means any natural or legal person who orders goods from the seller;',
              '*consumer* means a natural person who buys goods outside his or her trade, business, craft or profession;',
              '*contractor* means a buyer who buys goods for the purposes of his or her business or for carrying out works for third parties;',
              '*order* means the buyer’s offer to conclude a contract for the sale of goods;',
              '*distance contract* means a contract concluded through the website, by phone or by email, without the simultaneous physical presence of both parties;',
              '*goods* means the products displayed in the shop.',
            ],
          },
          {
            t: 'p',
            text: 'Provisions intended exclusively for consumers, such as the right of withdrawal from the contract, do not apply to buyers who are not consumers.',
          },
          {
            t: 'p',
            text: 'Goods may be ordered by persons who are of legal age and have legal capacity. You can read these terms on the website at any time, save them or print them.',
          },
        ],
      },
      {
        id: 'narucivanje',
        title: 'Ordering and conclusion of the contract',
        blocks: [
          { t: 'p', text: 'An order through the online shop takes place in the following steps:' },
          {
            t: 'ol',
            items: [
              'Choose the products and add them to the basket.',
              'Check the contents of the basket: the products, quantities and prices.',
              'Enter the details needed for delivery and contact (name, address, phone, email).',
              'Choose the delivery method and the payment method.',
              'Review the entire order and correct any input errors before sending it.',
              'Submit the order with the final button, which is clearly marked and states that the order obliges you to pay.',
            ],
          },
          {
            t: 'p',
            text: 'You can also place an order by phone or email; the same terms then apply.',
          },
          {
            t: 'p',
            text: 'By submitting an order, you make an offer to conclude a contract. The contract is concluded only when the seller confirms the order, by email or phone. Until confirmation, the seller is not obliged to deliver the goods.',
          },
          {
            t: 'p',
            text: 'If we do not confirm the order within a reasonable time, you can contact us, and until confirmation you can also withdraw the order. The seller may refuse or change an order, in particular because an item is unavailable, because of an obvious error in the price or description, or because delivery to the requested address is impossible. We notify you of this without delay, and if you have already paid, we refund the amount as described on the “Refunds” page. The procedure for an unavailable item is described on the “Order Status” page.',
          },
          {
            t: 'p',
            text: 'Photographs and product descriptions are for information only, and colours on screen may differ from the real ones. For technical details, contact us before ordering.',
          },
          {
            t: 'p',
            text: 'The buyer is responsible for the accuracy of the details entered when ordering. A wrong address or invalid contact details can delay delivery, and any additional costs arising as a result may fall on the buyer. With the order confirmation we send you these terms or a link to them, together with the order details.',
          },
        ],
      },
      {
        id: 'cijene-i-placanje',
        title: 'Prices, VAT and payment',
        blocks: [
          {
            t: 'p',
            text: 'All prices are stated in convertible marks (KM) and include value added tax (VAT). The price shown at the time the order is submitted and stated in the order confirmation is the one that applies.',
          },
          {
            t: 'p',
            text: 'The delivery cost, if charged, is communicated before you commit to paying.',
          },
          {
            t: 'p',
            text: 'The seller may change prices at any time, but a change does not affect orders that have already been confirmed. If we notice an obvious error in a price, we will notify you before confirmation and offer you the choice of confirming the order at the correct price or cancelling it without any obligation.',
          },
          {
            t: 'p',
            text: 'Payment is possible in cash on delivery or by bank transfer against a proforma invoice or quotation. Card payment through the website will be available once it is activated. Details are on the “Payment Methods” page. An invoice is issued for every order.',
          },
          {
            t: 'p',
            text: 'The invoice is issued in the name of the buyer stated in the order. For an invoice to a legal entity, state the company name, address, JIB and VAT number when ordering.',
          },
          {
            t: 'p',
            text: 'If payment against a proforma invoice does not arrive within the period stated in the proforma invoice, the seller may cancel the order and release the reserved goods, and will notify you of this. For payment under a special agreement, for example for contractors, the terms stated in the written quotation or contract apply.',
          },
        ],
      },
      {
        id: 'isporuka-odustanak-reklamacije',
        title: 'Delivery, withdrawal and complaints',
        blocks: [
          {
            t: 'p',
            text: '*Delivery.* The delivery area, lead times, costs, unloading and collection are described on the “Delivery” page. Delivery area: {zonaDostave}, and delivery lead time {rokIsporuke}.',
          },
          {
            t: 'p',
            text: '*Withdrawal from the contract.* A consumer has the right to withdraw from a distance contract within {rokOdustanka}, without giving a reason, except for goods for which, by their nature, this right does not exist. The procedure and the model form are on the “Right of Withdrawal” page, and the conditions for returning goods and money are on the “Returns” and “Refunds” pages.',
          },
          {
            t: 'p',
            text: '*Conformity and complaints.* The seller is liable for the conformity of the goods with the contract for the period prescribed by law. How to file a complaint is explained on the “Warranty and Complaints” page. A manufacturer’s warranty, when issued, is additional and does not exclude the seller’s liability.',
          },
          {
            t: 'p',
            text: '*Passing of risk.* The risk of damage to or loss of the goods passes to the buyer at the moment the goods are received. Inspect the goods on receipt as described on the “Delivery” page.',
          },
          {
            t: 'p',
            text: '*Exceptions.* Because of the nature of building materials, returns and withdrawal from the contract are not possible or are limited for goods that are cut, mixed or made to measure, for goods that have been installed or processed, for opened goods that are sensitive for hygiene reasons, and for damaged or used goods. A detailed description is on the “Right of Withdrawal” page.',
          },
        ],
      },
      {
        id: 'odgovornost-i-sadrzaj',
        title: 'Liability and website content',
        blocks: [
          {
            t: 'p',
            text: 'The seller is liable in accordance with the law. Nothing in these terms excludes or limits liability that cannot be excluded or limited under applicable regulations, or the rights guaranteed to the consumer by law.',
          },
          {
            t: 'p',
            text: 'The seller is not liable for damage caused by improper installation or use of the goods contrary to the manufacturer’s instructions, or for damage caused by circumstances beyond its control, to the extent permitted by law.',
          },
          {
            t: 'p',
            text: 'Technical and advisory information on the website is for information only. For the choice of materials for a specific building, contact our expert team or your designer.',
          },
          {
            t: 'p',
            text: 'The website content (texts, photographs, graphics, logos and design) is protected by copyright and related rights and belongs to the seller or to persons from whom the right of use has been obtained. Downloading, copying or publishing it without prior written consent is not permitted. Manufacturers’ names and marks belong to their owners.',
          },
          {
            t: 'p',
            text: 'The seller does not guarantee that the website will operate uninterrupted and error-free, and may suspend it temporarily for maintenance. The website may contain links to third-party websites, for whose content the seller is not responsible.',
          },
        ],
      },
      {
        id: 'licni-podaci',
        title: 'Personal data',
        blocks: [
          {
            t: 'p',
            text: 'We process the personal data you leave when ordering or enquiring to the extent necessary to perform the contract and in accordance with the applicable personal data protection regulations in Bosnia and Herzegovina. We do not sell personal data and we do not use it to send promotional messages without your consent. You have the right of access, rectification, erasure and the other rights described in the policy; send requests to {email}.',
          },
          {
            t: 'p',
            text: 'The purposes of processing, the legal bases, retention periods and your rights are described on the “Privacy Policy” page.',
          },
        ],
      },
      {
        id: 'sporovi-i-pravo',
        title: 'Dispute resolution and governing law',
        blocks: [
          {
            t: 'p',
            text: 'If you have a complaint, first contact the seller (email {email}, phone {telefon}). We try to resolve every complaint amicably.',
          },
          {
            t: 'p',
            text: 'You can also submit a complaint in writing, to the seller’s address or email, and we reply to a written complaint as soon as possible. Most misunderstandings can be resolved by talking, so please contact us before starting any proceedings.',
          },
          {
            t: 'p',
            text: 'A consumer may also request out-of-court dispute resolution in accordance with the law governing consumer protection, and may contact the competent consumer protection authority.',
          },
          {
            t: 'p',
            text: 'Disputes that are not resolved amicably are decided by the competent court in Banja Luka, unless the law provides otherwise.',
          },
          {
            t: 'p',
            text: 'These terms and the contract are governed by the law of Republika Srpska and Bosnia and Herzegovina, in particular the Republika Srpska Consumer Protection Act (Zakon o zaštiti potrošača Republike Srpske) and the Law on Obligations (Zakon o obligacionim odnosima).',
          },
        ],
      },
      {
        id: 'izmjene-i-kontakt',
        title: 'Changes to the terms and contact',
        blocks: [
          {
            t: 'p',
            text: 'The seller may change these terms. Changes apply from publication on the website and do not apply to orders confirmed before the change. The date of the latest change is shown at the top of the page.',
          },
          {
            t: 'p',
            text: 'The terms that were published at the time the order was submitted apply to the order. If any provision of these terms is void or inapplicable, the other provisions remain in force.',
          },
          {
            t: 'dl',
            items: [
              { k: 'Seller', v: '{naziv}' },
              { k: 'Address', v: '{sjediste}' },
              { k: 'Email', v: '{email}' },
              { k: 'Phone', v: '{telefon}' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 8. PRIVACY POLICY ─────────────────────────────
  {
    slug: 'politika-privatnosti',
    title: 'Privacy Policy',
    group: 'pravno',
    kicker: 'Personal data',
    lead: 'Here we explain which personal data we collect, why, how long we keep it and what rights you have. We use data only to the extent necessary to run the shop, and we do not sell it.',
    updated: UPDATED,
    sections: [
      {
        id: 'ko-obradjuje-podatke',
        title: 'Who processes your data',
        blocks: [
          {
            t: 'p',
            text: 'The controller is the party that decides why and how personal data is processed. For data collected through this website, that is {naziv} of Banja Luka (hereinafter: *we*).',
          },
          {
            t: 'dl',
            items: [
              { k: 'Controller', v: '{naziv}' },
              { k: 'Registered office', v: '{sjediste}' },
              { k: 'JIB (tax ID)', v: '{jib}' },
              { k: 'Questions about personal data', v: '{email}' },
              { k: 'Phone', v: '{telefon}' },
            ],
          },
          {
            t: 'p',
            text: 'This policy applies to the data you leave when shopping, sending enquiries and using the website. We process data in accordance with the applicable personal data protection regulations in Bosnia and Herzegovina.',
          },
          {
            t: 'p',
            text: 'Personal data is any information by which you can be identified, for example a name, address, phone number or email. Processing is any action carried out with data: collecting, storing, using, forwarding or deleting it.',
          },
        ],
      },
      {
        id: 'koje-podatke-obradjujemo',
        title: 'What data we process and when',
        blocks: [
          { t: 'p', text: 'The data we process depends on what you do on the website:' },
          {
            t: 'ul',
            items: [
              '*Orders:* first and last name (or company name), delivery address, phone, email, for legal entities the JIB and VAT number, the contents of the order and the chosen delivery and payment methods.',
              '*Enquiries and contact:* the data you enter in a form or send by email or phone, and the content of your message.',
              '*Enquiries for contractors and projects:* company name or name, contact details, construction site location, list of materials and deadline.',
              '*Technical data:* IP address, browser type, date and time of access and server logs, which are necessary for the operation and security of the website.',
            ],
          },
          {
            t: 'p',
            text: 'We mostly obtain data directly from you. From carriers we may receive notification of the delivery status. If you call us by phone or write by email, we may record your name, phone number and the content of the enquiry in order to deal with your request. For companies, we also process data about the contact person.',
          },
          {
            t: 'p',
            text: 'We use technical server logs only for the operation and security of the website and we do not link them to your orders for the purpose of profiling.',
          },
          {
            t: 'p',
            text: 'If you give us data about a third party, for example a contact person at a construction site or the recipient of a delivery, please do so only if that person is aware of it.',
          },
          {
            t: 'p',
            text: 'You provide data voluntarily, but without data necessary for an order, such as the delivery address, we cannot fulfil it. We do not collect special categories of personal data and we do not carry out profiling or automated decision-making about you. We do not ask for or store payment card details.',
          },
        ],
      },
      {
        id: 'svrhe-i-osnovi',
        title: 'Purposes and legal bases',
        blocks: [
          {
            t: 'dl',
            items: [
              {
                k: 'Processing orders, delivery, payment, withdrawal and complaints',
                v: 'Performance of the contract and steps we take at your request before the contract is concluded.',
              },
              {
                k: 'Order notifications (confirmation, change of delivery date, order status)',
                v: 'Performance of the contract.',
              },
              {
                k: 'Accounting, taxes and retention of documents',
                v: 'Legal obligation.',
              },
              {
                k: 'Keeping records of enquiries, complaints and requests',
                v: 'Our legitimate interest in proving what was requested and agreed and, where applicable, a legal obligation.',
              },
              {
                k: 'Replying to enquiries and preparing quotations',
                v: 'Steps taken at your request and our legitimate interest in replying to your enquiry.',
              },
              {
                k: 'Website security, preventing abuse, protecting legal claims',
                v: 'Legitimate interest.',
              },
            ],
          },
          {
            t: 'p',
            text: 'When processing is based on legitimate interest, we make sure that it does not override your rights and freedoms.',
          },
          {
            t: 'p',
            text: 'When processing is based on consent, the consent is voluntary and refusing it does not affect your ability to shop. Data that we need to perform a contract or because of a legal obligation cannot be deleted for as long as that obligation lasts.',
          },
        ],
      },
      {
        id: 'cuvanje-podataka',
        title: 'How long we keep data',
        blocks: [
          {
            t: 'p',
            text: 'We keep data for as long as is necessary for the purpose for which it was collected, or for as long as the law requires:',
          },
          {
            t: 'ul',
            items: [
              '*orders and invoices:* for as long as the law requires for accounting documents;',
              '*withdrawal and complaints:* while the periods for exercising rights and for any claims under the contract are running;',
              '*enquiries and correspondence:* for as long as is needed to reply and, if no contract is concluded, a further reasonable time afterwards;',
              '*technical logs:* for a shorter period, as long as is needed for the security and operation of the website.',
            ],
          },
          {
            t: 'p',
            text: 'When the purpose ends, we delete or anonymise the data, unless the law requires it to be kept for longer.',
          },
          {
            t: 'p',
            text: 'If a dispute or proceeding is under way before a competent authority, we keep the data needed for that proceeding until it ends. If you ask us to delete data that we are required by law to keep, we will tell you why we cannot delete it immediately.',
          },
        ],
      },
      {
        id: 'primaoci-i-prenos',
        title: 'Who we disclose data to and transfers outside BiH',
        blocks: [
          {
            t: 'p',
            text: 'We do not sell data. We share it only with parties we need in order to provide the service, to the extent necessary:',
          },
          {
            t: 'ul',
            items: [
              'carriers, to deliver the goods;',
              'accountants, to keep the business books and handle tax obligations;',
              'the hosting provider, which maintains the website;',
              'the payment processor, once card payment is activated;',
              'public authorities (for example tax authorities, inspectorates, courts), where the law requires it.',
            ],
          },
          {
            t: 'p',
            text: 'We give carriers only the data needed for delivery to be carried out (name, address, phone and the contents of the consignment). Our accountants receive the data contained in invoices and other business books. We do not share your data with other parties for advertising purposes.',
          },
          {
            t: 'p',
            text: 'Parties that process data on our behalf may use it only according to our instructions and for the purposes stated here.',
          },
          {
            t: 'p',
            text: 'The hosting provider may process data, for example technical logs, on servers outside Bosnia and Herzegovina. In that case the transfer is made with appropriate safeguards, in accordance with applicable regulations. We require the data to be protected to the level that regulations demand, for example through contractual data protection obligations. On request, we can give you more information about this.',
          },
        ],
      },
      {
        id: 'vasa-prava',
        title: 'Your rights',
        blocks: [
          { t: 'p', text: 'In relation to your data, you have the following rights:' },
          {
            t: 'ul',
            items: [
              '*access*: to find out whether we process your data and to receive a copy of the data we process about you;',
              '*rectification*: to have inaccurate or incomplete data corrected or completed;',
              '*erasure*: to have data deleted when there is no longer a basis for processing it;',
              '*restriction of processing*: to have data only stored temporarily, for example while we verify its accuracy;',
              '*objection* to processing based on legitimate interest;',
              '*portability*: to receive the data you gave us in a commonly used, readable form, where applicable;',
              '*withdrawal of consent* at any time, without affecting the lawfulness of processing before withdrawal.',
            ],
          },
          {
            t: 'p',
            text: 'You can send a request to {email} or by post to {sjediste}. We reply within the period prescribed by law, and to protect your data we may ask you to confirm your identity.',
          },
          {
            t: 'p',
            text: 'We consider requests free of charge, unless a request is manifestly unfounded or excessive, in accordance with regulations. If we refuse a request, we will tell you the reasons.',
          },
          {
            t: 'p',
            text: 'If you believe that your data is being processed contrary to regulations, you can lodge a complaint with the Personal Data Protection Agency in Bosnia and Herzegovina.',
          },
        ],
      },
      {
        id: 'sigurnost-i-newsletter',
        title: 'Security and minors',
        blocks: [
          {
            t: 'p',
            text: 'We apply technical and organisational safeguards proportionate to the nature of the data: access is limited to people who need it for their work, data transmitted between your browser and the website is protected by an encrypted connection, and we choose our partners and service providers carefully. No system is completely secure; in the event of a data breach that could threaten your rights, we will act in accordance with regulations, including notifying the competent authority and, where necessary, you.',
          },
          {
            t: 'p',
            text: 'We keep paper documents containing personal data, for example delivery notes and invoices, so that unauthorised persons cannot see them.',
          },
          {
            t: 'p',
            text: 'The website is not intended for persons under 16 and we do not knowingly collect their data. If you believe that a person under 16 has given us data, tell us and we will delete it.',
          },
        ],
      },
      {
        id: 'izmjene-i-kontakt',
        title: 'Changes to the policy and contact',
        blocks: [
          {
            t: 'p',
            text: 'We may change this policy, for example because of a change in regulations or new website features. The current version is always published on this page, and the date of the latest change is shown at the top. Earlier versions are available on request. If anything in this policy is unclear, ask us before you leave your data. If we introduce processing that requires your consent, we will ask for it before processing begins.',
          },
          {
            t: 'p',
            text: 'You can direct questions about personal data protection to {email} or by phone on {telefon}.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 10. RIGHT OF WITHDRAWAL ─────────────────────────────
  {
    slug: 'odustanak-od-ugovora',
    title: 'Right of Withdrawal',
    group: 'pravno',
    kicker: 'Withdrawal',
    lead: 'If you are a consumer and you ordered the goods at a distance, you can withdraw from the contract within {rokOdustanka}, without giving a reason. Below are the procedure and the model form.',
    updated: UPDATED,
    sections: [
      {
        id: 'pravo-na-odustanak',
        title: 'The right of withdrawal',
        blocks: [
          {
            t: 'p',
            text: 'A consumer has the right to withdraw from a distance contract (concluded through the website, by phone or by email) within {rokOdustanka}, without giving a reason and without a contractual penalty.',
          },
          {
            t: 'p',
            text: 'You can withdraw even before you receive the goods: it is enough to tell us. Withdrawal releases both parties from their obligations under the contract, and everything received is returned.',
          },
          {
            t: 'p',
            text: 'The period runs from the day on which you, or a person you designated (other than the carrier), took delivery of the goods. If several items were ordered at once but delivered separately, the period runs from receipt of the last item or the last consignment.',
          },
          {
            t: 'p',
            text: 'Only consumers have the right of withdrawal. It does not apply to legal entities and to contractors who buy goods for their business.',
          },
        ],
      },
      {
        id: 'kako-odustati',
        title: 'How to withdraw',
        blocks: [
          {
            t: 'ol',
            items: [
              'Send us a clear statement that you are withdrawing from the contract: by email to {email} or by post to {sjediste}. You can also communicate the withdrawal by phone ({telefon}), but confirm it in writing as well, for evidence.',
              'State the order number, the items and the date on which you received the goods.',
              'You can use the model form below, but this is not mandatory.',
              'It is enough to send the statement before the {rokOdustanka} period expires.',
            ],
          },
          {
            t: 'p',
            text: 'We acknowledge receipt of your statement without delay.',
          },
        ],
      },
      {
        id: 'vracanje-robe',
        title: 'Returning the goods',
        blocks: [
          {
            t: 'p',
            text: 'Return the goods without undue delay and no later than {rokOdustanka} from the day you told us of your withdrawal. The deadline is met if you send the goods back before it expires.',
          },
          {
            t: 'p',
            text: 'You return the goods in the condition in which you received them, preferably in the original packaging, with accessories and documents. You bear the cost of returning them, unless we have stated otherwise. For heavy and palletised goods, arrange transport with us in advance (see “Returns”).',
          },
        ],
      },
      {
        id: 'povrat-novca',
        title: 'Refund',
        blocks: [
          {
            t: 'p',
            text: 'We refund all payments we received from you, including the cost of standard delivery, using the same payment method with which you paid. We do so without undue delay and no later than {rokOdustanka} from the day we received your statement of withdrawal. We may wait until we have received the goods or until you prove that you have sent them.',
          },
          {
            t: 'p',
            text: 'Additional costs of a more expensive delivery method you chose are not refunded. If the value of the goods has been reduced because of handling that was not necessary to establish their nature, you are liable for that reduction. Details are on the “Refunds” page.',
          },
        ],
      },
      {
        id: 'izuzeci',
        title: 'When withdrawal is not possible',
        blocks: [
          {
            t: 'p',
            text: 'Because of the nature of the goods, the right of withdrawal does not exist or is limited for:',
          },
          {
            t: 'ul',
            items: [
              'goods that have been cut, mixed or made to measure or to the buyer’s specification;',
              'goods that have been installed or processed so that they cannot be returned in their original condition;',
              'opened bags of binders (compounds, adhesives, cement) and bags that have been stored in damp conditions;',
              'damaged or used goods whose value has been reduced beyond what is needed for inspection.',
            ],
          },
          {
            t: 'p',
            text: 'When the goods are defective, your rights remain the same. See “Warranty and Complaints”.',
          },
        ],
      },
      {
        id: 'model-obrasca',
        title: 'Model form',
        blocks: [
          {
            t: 'box',
            title: 'Model withdrawal form',
            lines: [
              '(Complete and send this form only if you wish to withdraw from the contract.)',
              'To: {naziv}, {sjediste}, email: {email}',
              'I hereby give notice that I withdraw from my contract for the purchase of the following goods: ______________________________',
              'Ordered on: ______________ / Received on: ______________ (order number: ______________)',
              'Name of consumer: ______________________________',
              'Address of consumer: ______________________________',
              'Signature of consumer (only if this form is submitted on paper): ______________________________',
              'Date: ______________',
            ],
          },
          {
            t: 'note',
            text: 'Using the form is not mandatory; any clear statement of withdrawal is sufficient.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 11. SELLER INFORMATION ─────────────────────────────
  {
    slug: 'o-prodavcu',
    title: 'Seller Information',
    group: 'pravno',
    kicker: 'Imprint',
    lead: 'Who the seller is, how you can contact us and whom you can turn to as a consumer.',
    updated: UPDATED,
    sections: [
      {
        id: 'podaci',
        title: 'Seller information',
        blocks: [
          {
            t: 'p',
            text: '{naziv} is engaged in wholesale and retail trade in building materials: drywall systems, stone wool, facade, thermal insulation, waterproofing and roofing systems, tile adhesives, cements, machine-applied plasters, iron and blocks, and, on request, chimney and pipe systems, paving and sintered stone. The registered activity is wholesale trade in timber, building materials and sanitary equipment. The shop is intended for private customers, tradespeople and construction companies.',
          },
          {
            t: 'dl',
            items: [
              { k: 'Name', v: '{naziv}' },
              { k: 'Registered office', v: '{sjediste}' },
              {
                k: 'Activity',
                v: 'Trade in building materials, wholesale and retail',
              },
              { k: 'JIB (tax ID)', v: '{jib}' },
              { k: 'VAT number', v: '{pdv}' },
              { k: 'Company registration number (MBS)', v: '{registracija}' },
              { k: 'Current account', v: '{racun}' },
              { k: 'Email', v: '{email}' },
              { k: 'Phone', v: '{telefon}' },
              { k: 'Web', v: '{web}' },
              { k: 'Founder', v: '{osnivac}' },
              { k: 'In business since', v: '{osnovano}' },
            ],
          },
        ],
      },
      {
        id: 'kontakt',
        title: 'Contact',
        blocks: [
          {
            t: 'p',
            text: 'For orders, deliveries, complaints and enquiries, use the email {email} or the phone {telefon}. Quote the order number in your message, if there is one. We record messages received by email and reply to them as soon as possible, and for a quicker reply, also leave a contact phone number.',
          },
          {
            t: 'p',
            text: 'The “Enquiry for Contractors and Projects” page is intended for contractors and larger projects.',
          },
        ],
      },
      {
        id: 'pravni-tekstovi',
        title: 'Legal texts and help',
        blocks: [
          {
            t: 'ul',
            items: [
              '“Terms of Purchase”: how to order, prices, payment and governing law;',
              '“Privacy Policy”: what data we process and why;',
              '“Right of Withdrawal”, “Returns” and “Refunds”: your rights as a consumer;',
              '“Warranty and Complaints”: what to do when the goods are defective.',
            ],
          },
        ],
      },
      {
        id: 'zastita-potrosaca',
        title: 'Consumer protection',
        blocks: [
          {
            t: 'p',
            text: 'If you have a complaint about the goods or service, first contact the seller. The complaints procedure is described on the “Warranty and Complaints” page.',
          },
          {
            t: 'p',
            text: 'If the problem is not resolved amicably, a consumer can contact the competent consumer protection authority or the market inspectorate, or request out-of-court dispute resolution, in accordance with the law. Consumer rights arising from regulations are not limited by anything stated on this website.',
          },
        ],
      },
      {
        id: 'sadrzaj-sajta',
        title: 'Website content',
        blocks: [
          {
            t: 'p',
            text: 'We strive to keep descriptions, prices and availability of products accurate and up to date, but mistakes are possible. The order confirmation is what applies. If you notice an error in a description, price or availability, let us know so that we can correct it.',
          },
          {
            t: 'p',
            text: 'The texts, photographs, graphics and design of the website are protected by copyright (see “Terms of Purchase”). Manufacturers’ names and marks belong to their owners. You can send comments on the content to {email}.',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── 13. ENQUIRY FOR CONTRACTORS ─────────────────────────────
  {
    slug: 'upit-za-izvodjace',
    title: 'Enquiry for Contractors and Projects',
    group: 'usluge',
    kicker: 'For contractors',
    lead: 'For contractors and larger projects we prepare an individual quotation, and our expert team helps with the choice of materials. Send an enquiry with quantities and a deadline, and we reply with a quotation.',
    updated: UPDATED,
    sections: [
      {
        id: 'sta-poslati',
        title: 'What to send in an enquiry',
        blocks: [
          {
            t: 'ul',
            items: [
              'company name or first and last name;',
              'a contact person, phone and email;',
              'the construction site location (address and a description of access);',
              'a list of materials with quantities, or a bill of quantities for the works;',
              'the desired delivery date or start date of the works;',
              'notes: technical requirements and project documentation, if you have them.',
            ],
          },
          {
            t: 'p',
            text: 'The more complete the enquiry, the faster and more accurate the reply. You can send an enquiry through the form on the website, by email ({email}) or by phone ({telefon}).',
          },
        ],
      },
      {
        id: 'sta-nudimo',
        title: 'What we offer',
        blocks: [
          {
            t: 'p',
            text: 'Terms are set individually, depending on the type and scope of the job. It is possible to agree:',
          },
          {
            t: 'ul',
            items: [
              'an individual quotation based on the bill of quantities;',
              'quantity terms;',
              'an arrangement for delivery to the construction site (dates, delivery in stages, unloading method);',
              'payment terms by special agreement.',
            ],
          },
          {
            t: 'p',
            text: 'These are possibilities that are confirmed in a written quotation. They are not fixed in advance and do not apply automatically.',
          },
        ],
      },
      {
        id: 'kako-tece-saradnja',
        title: 'How the cooperation works',
        blocks: [
          {
            t: 'ol',
            items: [
              '*Enquiry.* You send details of the job, quantities and deadline.',
              '*Quotation.* We prepare a written quotation with prices and delivery terms.',
              '*Confirmation.* You accept the quotation and we confirm it. The contract is concluded when both parties agree on the quotation.',
              '*Delivery.* We deliver the goods at the agreed times, to the construction site or for collection in person.',
            ],
          },
        ],
      },
      {
        id: 'strucni-savjet',
        title: 'Expert advice',
        blocks: [
          {
            t: 'p',
            text: 'Our expert team helps with the choice of materials, for example drywall systems or insulation for a wall, attic and roof. If you are not sure what suits your job, describe the task and we will help.',
          },
          {
            t: 'p',
            text: 'The advice is for information only. The design solution and responsibility for the project remain with the designer and the contractor.',
          },
        ],
      },
      {
        id: 'placanje-i-dokumenti',
        title: 'Payment and documents',
        blocks: [
          {
            t: 'p',
            text: 'Payment terms for contractors and larger projects are agreed individually and are valid only if they are stated in a written quotation or contract. The usual payment methods are described on the “Payment Methods” page.',
          },
          {
            t: 'p',
            text: 'The invoice is issued to the company. In your enquiry, state the invoicing details: name, address, JIB and VAT number.',
          },
        ],
      },
      {
        id: 'kontakt',
        title: 'Contact',
        blocks: [
          {
            t: 'dl',
            items: [
              { k: 'Email', v: '{email}' },
              { k: 'Phone', v: '{telefon}' },
              { k: 'Address', v: '{sjediste}' },
            ],
          },
          {
            t: 'p',
            text: 'We use the data from your enquiry only to prepare a quotation and for cooperation. More on the “Privacy Policy” page.',
          },
        ],
      },
    ],
  },
]

// Dokument u izabranom jeziku (isti slug); ako engleske verzije nema, vraća srpsku.
export function legalDocFor(doc: LegalDoc, lang: Lang): LegalDoc {
  if (lang !== 'en') return doc
  return LEGAL_DOCS_EN.find((d) => d.slug === doc.slug) ?? doc
}

export function legalDocsFor(lang: Lang): LegalDoc[] {
  return lang === 'en' ? LEGAL_DOCS_EN : LEGAL_DOCS
}
