import { BUSINESS } from '../config'
import { buildWhatsAppLink } from '../utils/whatsapp'
import { WhatsAppIcon } from './icons'

export default function WhatsAppFloat() {
  const link = buildWhatsAppLink(
    `Hello ${BUSINESS.name}! I would like to place a pre-order.`,
  )
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1EBE5A]"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
