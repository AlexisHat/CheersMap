import { CameraView } from "expo-camera";

export const wait = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));
  
export const captureDualPhotosWithCountdown = async (
    cameraRef: React.RefObject<CameraView | null>,
    setCountdown: (val: number | null) => void,
    setFacing: (val: "front" | "back") => void
  ): Promise<{ back: string; front: string }> => {
    if (!cameraRef.current) throw new Error("Camera reference missing");
  
    const backPhoto = await cameraRef.current.takePictureAsync({ quality: 1, skipProcessing: true });
  
    
  
    setFacing("front");
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await wait(1000);
    }
    setCountdown(null); 
  
    const frontPhoto = await cameraRef.current.takePictureAsync({ quality: 1, skipProcessing: true });
  
    setFacing("back");
  
    if (!backPhoto) {
        throw new Error("Fehler beim Aufnehmen des Rückfotos.");
      }
    if (!frontPhoto) {
        throw new Error("Fehler beim Aufnehmen des Vorderfotos.");
    }
      
    return {
      back: backPhoto.uri,
      front: frontPhoto.uri,
    };
  };
  