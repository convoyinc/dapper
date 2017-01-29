
interface StyleSheet {
  insertRule: (rule: string, index: number) => void;
  cssRules: CSSRuleList;
}
