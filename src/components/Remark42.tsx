import {useEffect} from 'preact/hooks'
interface Remark {
  changeTheme: (theme: string) => void;
}

interface RemarkConfig {
  host: string;
  site_id: string;
  url: string;
  theme: string;
  components: string[];
}

declare global {
  // Declare the global types for REMARK42 and remark_config so they can be used in this module.
  interface Window {
    REMARK42: Remark;
    remark_config: RemarkConfig;
  }
}

// Function to insert the Remark42 script into the DOM.
const insertScript = (id: string, parentElement: HTMLElement) => {
  const script = window.document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.id = id

  // Get the current URL, and remove trailing slash if it exists.
  let url = window.location.origin + window.location.pathname
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }

  // Get the host from the environment variables.
  const host = 'https://remark42-himmel.fly.dev' //import.meta.env.PUBLIC_REMARK_URL

  // Set the inner HTML of the script to load Remark42.
  script.innerHTML = `
    var remark_config = {
      host: "${host}",
      site_id: "remark",
      url: "${url}",
      theme: "light",
      components: ["last-comments", "embed"],
    };
    !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);`

  // Append the script to the parent element.
  parentElement.appendChild(script)
}

// Function to remove the Remark42 script from the DOM.
const removeScript = (id: string, parentElement: HTMLElement) => {
  const script = window.document.getElementById(id)
  if (script) {
    parentElement.removeChild(script)
  }
}

// Function to manage the insertion and removal of the Remark42 script.
const manageScript = () => {
  if (!window) {
    return () => {}
  }
  const {document} = window
  if (document.getElementById('remark42')) {
    insertScript('comments-script', document.body)
  }
  // Return a cleanup function to remove the script when the component unmounts.
  return () => removeScript('comments-script', document.body)
}

export function Remark42() {
  // State for tracking the current theme.
  //const [theme, setTheme] = useState('light')

  // Use effect to manage the Remark42 script.
  useEffect(manageScript, [])

  /* Use effect to update the theme when it changes.
  useEffect(() => {
    if (window.REMARK42) {
      window.REMARK42.changeTheme(theme)
    }
  }, [theme])

  // Function to toggle the theme.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'light'))
  }*/

  return (
    <>
    <div style={{ height: '20px' }}/>
      <div id="remark42"/>
    </>
  )
}
