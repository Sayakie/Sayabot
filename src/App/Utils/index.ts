export const Process = {
  setTitle(title: string) {
    process.title = title
  },

  getTitle() {
    return process.title
  }
}
