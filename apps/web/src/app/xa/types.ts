interface QAPairConfigBase {
  shortId: string
  hint: string
  defaultQuestion?: string
  promptId: string
  historyLength: number
}

export type InputType =
  | 'single-line-input'
  | 'multi-line-input'
  | 'date-input'
  | 'single-select'
  | 'multi-select'

export interface TextQAPair extends QAPairConfigBase {
  inputType: 'single-line-input' | 'multi-line-input'
  placeholder?: string
}

export interface SingleSelectionQAPair extends QAPairConfigBase {
  inputType: 'single-select'
  options: { display: string; value: string }[]
}

export interface MultiSelectionQAPair extends QAPairConfigBase {
  inputType: 'multi-select'
  options: string[]
}

export interface DateQAPair extends QAPairConfigBase {
  inputType: 'date-input'
}

export type QAPairConfig =
  | TextQAPair
  | SingleSelectionQAPair
  | MultiSelectionQAPair
  | DateQAPair

export interface QuestionRequestBase {
  history: Message[]
}
export interface QuestionRequestBody extends QuestionRequestBase {
  currentQuestion: QAPairConfig
}
export interface QuestionBotAPIRequestBody extends QuestionRequestBase {
  promptId: string
  [key: string]: string | Message[] | never
}


export interface Message {
  role: 'assistant' | 'user'
  content: string
}

export interface TagClusters {
  [category: string]: string[]
}
