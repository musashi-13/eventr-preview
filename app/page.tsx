import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false


export default function Home() {
  return (
    <main className=''>
      <h1 className='text-4xl md:text-5xl lg:text-6xl w-4/5 md:w-2/3 lg:w-1/2 px-4 md:px-8 lg:px-12 py-16'>
        Your Trusted Ticketing Partner
      </h1>
    </main>
  );
}
