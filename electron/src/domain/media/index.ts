const load = (window as any).require;
const desktopCapturer = load("electron").desktopCapturer;

export function getScreen() {
  return new Promise<MediaStream>(resolve => {
    desktopCapturer.getSources(
      { types: ["screen", "window"] },
      (_: any, sources: any) => {
        console.log(sources);
      }
    );

    const nav = navigator.mediaDevices as any;
    nav
      .getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: "desktop"
          }
        },
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: "screen:0:0"
          },
          optional: [{ maxFrameRate: 25 }]
        }
      })
      .then((stream: any) => {
        resolve(stream);
      })
      .catch(() => {
        nav
          .getUserMedia({
            video: {
              mandatory: {
                chromeMediaSource: "desktop"
              }
            }
          })
          .then((stream: any) => {
            resolve(stream);
          });
      });
  });
}
