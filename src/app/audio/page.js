"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
   Table,
   TableHeader,
   TableBody,
   TableRow,
   TableHead,
   TableCell,
} from '../../components/ui/table';

const Page = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioContext = useRef(null);
  const audioSource = useRef(null);

  useEffect(() => {
    const savedRecordings = JSON.parse(localStorage.getItem('recordings')) || [];
    setRecordings(savedRecordings);
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      saveRecording(audioBlob);
      audioChunks.current = [];
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  const saveRecording = (audioBlob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result.split(',')[1];
      const newRecording = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        audio: base64Audio,
      };

      const updatedRecordings = [...recordings, newRecording];
      setRecordings(updatedRecordings);
      localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
    };
    reader.readAsDataURL(audioBlob);
  };

  const deleteRecording = (id) => {
    const updatedRecordings = recordings.filter(recording => recording.id !== id);
    setRecordings(updatedRecordings);
    localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
    if (id === currentPlayingId) {
      stopAudio();
    }
  };

  const playBufferedAudio = async (audioBase64, recordingId) => {
    if (currentPlayingId === recordingId) {
      stopAudio();
      return;
    }
    if (audioContext.current) {
      stopAudio();
    }

    audioContext.current = new AudioContext();
    const audioData = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    const audioBuffer = await audioContext.current.decodeAudioData(audioData.buffer);

    audioSource.current = audioContext.current.createBufferSource();
    audioSource.current.buffer = audioBuffer;
    audioSource.current.connect(audioContext.current.destination);
    audioSource.current.start();
    setCurrentPlayingId(recordingId);

    audioSource.current.onended = () => {
      setCurrentPlayingId(null);
      audioContext.current.close();
      audioContext.current = null;
      audioSource.current = null;
    };
  };

  const stopAudio = () => {
    if (audioSource.current) {
      audioSource.current.stop();
      audioSource.current.disconnect();
    }
    setCurrentPlayingId(null);
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
  };

  return (
    <div className='container mx-auto p-4 ml-20 mt-20 mr-20'>
      <h1 className='text-2xl font-bold'>Audio Recorder</h1>
      <div className='flex items-center mt-4 space-x-4'>
        <button 
          className={`px-4 py-2 text-white rounded ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {recordings.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-xl font-semibold'>Saved Recordings</h2>
          <Table className='w-full'>
            <TableHeader>
              <TableRow className="space-x-6">
                <TableHead className='px-6 py-4 text-left w-1/5'>ID</TableHead>
                <TableHead className='px-6 py-4 text-left w-2/5'>Date</TableHead>
                <TableHead className='px-6 py-4 text-left w-2/5'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recordings.map((recording, index) => (
                <TableRow key={recording.id} className="space-x-6">
                  <TableCell className='px-6 py-4'>{index + 1}</TableCell>
                  <TableCell className='px-6 py-4'>{recording.date}</TableCell>
                  <TableCell className='px-6 py-4'>
                    <button 
                      className={`px-4 py-2 rounded mr-2 ${currentPlayingId === recording.id ? 'bg-red-500' : 'bg-blue-500'} text-white`}
                      onClick={() => playBufferedAudio(recording.audio, recording.id)}
                    >
                      {currentPlayingId === recording.id ? 'Stop' : 'Play'}
                    </button>
                    <button 
                      className='px-4 py-2 bg-red-500 text-white rounded'
                      onClick={() => deleteRecording(recording.id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Page;
