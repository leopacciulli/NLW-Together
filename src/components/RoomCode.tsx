import copy from '../assets/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string
}

export function RoomCode(props: RoomCodeProps) {
  const copyRoom = () => {
    navigator.clipboard.writeText(props.code)
  }

  return (
    <button className="room-code" onClick={copyRoom}>
      <div>
        <img src={copy} alt="copy" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}