import { FaVolumeUp } from "react-icons/fa";

interface SpeakerProps {
  audioPath: string;
  color: string;
}

const Speaker: React.FC<SpeakerProps> = ({ audioPath, color }) => {
  const playAudio = (audioPath: string) => {
    const audio = new Audio(audioPath);
    audio.play();
  };

  return (
    <FaVolumeUp
      className={`absolute -top-6 right-6 translate-x-1/2 text-2xl cursor-pointer ${color}`}
      onClick={() => playAudio(audioPath)}
    />
  );
};

export default Speaker;
