import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { XMLParser, type X2jOptions } from 'fast-xml-parser'

export function sigmoidModel(x: number) {
  const sigmoid = (x: number, k: number) => 1 / (1 + Math.exp(-x / k))
  return (sigmoid(x, 12) - 0.5) * 200
}

export function getAgeWithVerify(birthDay: string): number {
  const birthDayInMs = new Date(birthDay).getTime()
  if (birthDayInMs === 946656000000) return 0
  const diff = Date.now() - birthDayInMs
  const age = new Date(diff).getFullYear() - 1970
  return age < 100 ? age : 0
}

export function verifyMBTI(mbti: string) {
  const uppercase = mbti.trim().slice(0.4).toUpperCase()
  const verifyArray = [
    ['I', 'E'],
    ['S', 'N'],
    ['T', 'F'],
    ['J', 'P'],
  ]
  return verifyArray.every(
    ([a, b]) => uppercase.includes(a) !== uppercase.includes(b),
  )
}

export function parsePathname(pathname: string) {
  const path = pathname.startsWith('/') ? pathname.slice(1) : pathname
  const parts = path.split('/')
  return parts
}

export function getIsAppleFan() {
  const u = navigator.userAgent
  return !!u.match(/iPhone/i) || !!u.match(/iPad/i)
}

export function getTimeGapByHour(timestamp: number) {
  const currentTS = Date.now()
  const diffInMs = currentTS - timestamp
  return diffInMs / 3.6e6 // 1 hour = 3.6e6 ms
}

interface ParsedMessage {
  text: string
  attrs?: MessageAttributes
}

interface MessageAttributes {
  'need-ai-reply'?: 'true'
  'need-group-ai-reply'?: 'true'
  hide?: 'true'
  statusId?: string
  imageURL?: string
  kind?: 'invite' | 'remove' | 'init'
  quote?:string
}

export function XML2JSON(raw: string): ParsedMessage {
  const options: Partial<X2jOptions> = {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    parseAttributeValue: true,
    allowBooleanAttributes: true,
    unpairedTags: ['unpaired']
  }

  const parser = new XMLParser(options)
  
  const [parsed] = Object.values(parser.parse(raw)) as any

  const result: Partial<ParsedMessage> = {}

  if (typeof parsed === 'string' || typeof parsed === 'number') {
    result.text = parsed+''
  } else {
    result.text = parsed['#text']
    delete parsed['#text']
    result.attrs = parsed
  }

  return result as ParsedMessage
}

export function getTimeAgo(timestamp: string) {
  dayjs.extend(relativeTime)
  dayjs.extend(updateLocale)

  dayjs.updateLocale('en', {
    relativeTime: {
      future: '%s前',
      past: '%s前',
      s: '几秒',
      m: '1分钟',
      mm: '%d分钟',
      h: '1小时',
      hh: '%d小时',
      d: '1天',
      dd: '%d天',
      M: '1个月',
      MM: '%d个月',
      y: '一年',
      yy: '%d年',
    },
  })
  return dayjs(timestamp).fromNow()
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function memoize<T>(fn: () => T) {
  let cache: T
  return () => cache ?? (cache = fn())
}

export function memoizeWithArg<T, U>(fn: (arg: U) => T) {
  const cache = new Map<U, T>()
  return (arg: U) => cache.get(arg) ?? (cache.set(arg, fn(arg)), cache.get(arg)!)
}

export async function readFileAsDataURL(file: File): Promise<string> {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  return await new Promise(resolve => {
    reader.onload = () => resolve(reader.result as string)
  })
}

export function getPropagatedAttribute(element: HTMLElement, attr: string) {
  return element.getAttribute(attr) ||
    element.parentElement?.getAttribute(attr)
} 


// Only for XA sorting hat
export function textAnimation(element: any, target:string, fixedLength: number) {

  let iteration = 0;
  const letters = "ABCDEFGHJKLNOPQRSTUVXYZ";

  let interval = setInterval(() => {
    if (!element) return;
    element.innerText = target
      .split("")
      .map((_, index) => {
        if(index < fixedLength || index < iteration) {
          return target[index]
        }
      
        return letters[Math.floor(Math.random() * letters.length)]
      })
      .join("");
    
    if(iteration >= target.length){ 
      clearInterval(interval)
    }
    
    iteration += 1 / 3;
  }, 30)
  return interval
}

export function validEmail(email: string) {
  return !!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
}