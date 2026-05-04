import { ref } from 'vue'

export function useWhatsApp() {
    // Use the requested number, stored without spaces for valid deep links
    const whatsappNumber = ref('966509505588')

    // Format with spaces for display purposes
    const displayWhatsAppNumber = ref('+966 50 950 5588')

    // Helper function to generate proper WhatsApp deep link
    // Message is optional and can be passed to pre-fill the chat
    const generateWhatsAppLink = (message = '') => {
        const baseUrl = `https://wa.me/${whatsappNumber.value}`
        if (message) {
            return `${baseUrl}?text=${encodeURIComponent(message)}`
        }
        return baseUrl
    }

    // Helper function to open WhatsApp in a new tab
    const openWhatsApp = (message = '') => {
        window.open(generateWhatsAppLink(message), '_blank', 'noopener,noreferrer')
    }

    return {
        whatsappNumber,
        displayWhatsAppNumber,
        generateWhatsAppLink,
        openWhatsApp
    }
}
