type Props = {
  message: string
}

export function ErrorMessage({ message }: Props) {
  return <div className="text-red-600">{message}</div>
}
