import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is Elsamultiskill?',
    answer:
      'Elsamultiskill is a comprehensive directory for OpenClaw AI agent skills. It provides a searchable catalog of over 1700 skills that can be installed to enhance AI agents with additional capabilities, from web development to automation and beyond.',
  },
  {
    question: 'How do I install a skill?',
    answer:
      'Installing a skill is simple. Find the skill you want, copy the install command (e.g., "npx clawhub@latest install skill-name"), and run it in your terminal. The skill will be automatically downloaded and configured for your AI agent.',
  },
  {
    question: 'Is Elsamultiskill free to use?',
    answer:
      'Yes, Elsamultiskill is completely free to use. All skills listed in the directory are open-source and available at no cost. You can browse, search, and install any skill without any payment or subscription.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'Creating an account is optional. You can browse and install skills without an account. However, having an account allows you to bookmark your favorite skills for quick access later.',
  },
  {
    question: 'How do I bookmark a skill?',
    answer:
      'To bookmark a skill, first log in to your account. Then, click the bookmark icon on any skill card or skill detail page. Your bookmarked skills will be saved and accessible from the Bookmarks page.',
  },
  {
    question: 'What are the system requirements?',
    answer:
      'To install and use skills, you need Node.js version 18 or higher and npm (Node Package Manager). Most skills are platform-independent and work on Windows, macOS, and Linux.',
  },
  {
    question: 'How do I update a skill?',
    answer:
      'You can update a skill using the command "npx clawhub@latest update skill-name". To update all installed skills at once, use "npx clawhub@latest update --all".',
  },
  {
    question: 'Can I contribute my own skill?',
    answer:
      'Yes! OpenClaw welcomes community contributions. Visit the GitHub repository to learn how to create and submit your own skill. All contributions go through a review process before being added to the directory.',
  },
  {
    question: 'How are skills organized?',
    answer:
      'Skills are organized into 31 categories such as Web & Frontend Development, AI & LLMs, DevOps & Cloud, and more. You can filter by category when browsing, or use the search function to find specific skills.',
  },
  {
    question: 'What if a skill is not working?',
    answer:
      'If you encounter issues with a skill, first check the GitHub page for known issues or updates. You can also report bugs directly on the skill\'s GitHub repository. The community is active and typically responds quickly.',
  },
  {
    question: 'How often is the directory updated?',
    answer:
      'The skill directory is updated regularly as new skills are contributed and existing ones are improved. Featured and popular skills are curated weekly to highlight the best tools available.',
  },
  {
    question: 'Can I use multiple skills together?',
    answer:
      'Absolutely! Skills are designed to be modular and composable. You can install multiple skills and they will work together seamlessly. There are no conflicts between different skills.',
  },
]

function FAQAccordion({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-medium text-text-primary group-hover:text-brand transition-colors pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180 text-brand' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-text-secondary">{item.answer}</p>
      </div>
    </div>
  )
}

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-text-secondary">
            Find answers to common questions about Elsamultiskill and OpenClaw skills.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          <div className="card">
            {faqs.map((faq, index) => (
              <FAQAccordion
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
            <p className="text-text-secondary mb-6">
              Check out our documentation or reach out to the community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/docs" className="btn-primary">
                Read Documentation
              </Link>
              <a
                href="https://github.com/openclaw/skills"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Visit GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
