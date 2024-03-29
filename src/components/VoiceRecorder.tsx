'use client';

import { useState } from 'react';

interface VoiceRecorderProps {}

const VoiceRecorder: React.FC<VoiceRecorderProps> = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  let recordingChunks: BlobPart[] = [];
  const [audioUrl, setAudioUrl] = useState<string>('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        // if (e.data.size > 0) {
        //   setAudioChunks((prevChunks) => [...prevChunks, e.data]);
        // }
        recordingChunks.push(e.data);
        console.log(recordingChunks);
      };

      recorder.onstop = () => {
        // const audioBlob = new Blob(audioChunks, { type: 'audio/mp4' });
        const audioBlob = new Blob(recordingChunks, { type: 'audio/mp4' });
        const audioUrl = URL.createObjectURL(audioBlob);
        // const audio = new Audio(audioUrl);
        // audio.play();
        setAudioUrl(audioUrl);
        console.log(audioUrl);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h3 className='text-xl mb-4'>Only for a mic ability tests</h3>
      {/* <div
        className='icon'
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
      >
        🎤
      </div> */}
      <button
        onClick={startRecording}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 disabled:cursor-not-allowed mr-6'
        disabled={isRecording}
      >
        Record
      </button>
      <button
        onClick={stopRecording}
        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 disabled:cursor-not-allowed'
        disabled={!isRecording}
      >
        Stop
      </button>
      <p>{isRecording ? 'Recording...' : 'Press to record'}</p>
      {audioUrl && (
        <div>
          <p>{audioUrl}</p>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
