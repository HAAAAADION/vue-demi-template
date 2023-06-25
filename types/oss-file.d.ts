export interface TypeOssFileState {
  path?: string
  previewList: string[]
  previewIndex: number
  actionMap: Record<
    string,
    {
      icon: string
      click: () => void
    }
  >
}
