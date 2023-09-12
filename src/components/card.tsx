import { useEffect, useRef, useState } from "react";
import { data } from "../shared/data";

interface Props {
  item: (typeof data)[number];
  timeoutRef: React.MutableRefObject<number>;
  toggleMute: () => void;
  muted: boolean;
}

type ChangeEvent = React.MouseEventHandler<HTMLDivElement>;

const videoSrcs = {
  moneyHeist: "../assets/moneyheiest.mp4",
  sonic: "../assets/sonic.mp4",
  witcher: "../assets/witcher.mp4",
  lostinspace: "../assets/lostinspace.mp4",
};

export const Card = (props: Props) => {
  const {
    item,
    timeoutRef,
    muted: mutedProp,
    toggleMute: toggleMuteProp,
  } = props;
  const [active, setActive] = useState(false);
  const [remove, setRemove] = useState(true);
  const [video, setVideo] = useState(false);
  const [muted, setMuted] = useState(mutedProp);
  const [videoSRC, setVideoSRC] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  const onMouseEnter: ChangeEvent = (e) => {
    clearInterval(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActive(true);
      setRemove(false);
      setVideo(true);
    }, 1000);
  };
  const onMouseLeave: ChangeEvent = (e) => {
    setActive(false);
    setVideo(false);
    console.log(e);
  };

  const videoSrc =
    item.videoModel.title === "Lost in Space"
      ? videoSrcs.lostinspace
      : item.videoModel.title === "The Witcher"
      ? videoSrcs.witcher
      : item.videoModel.title === "Money Heist"
      ? videoSrcs.moneyHeist
      : videoSrcs.sonic;

  const toggleMute = () => {
    setMuted((p) => !p);
    if (mutedProp) {
      toggleMuteProp();
    }
  };

  useEffect(() => {
    (async function () {
      const video = await import(videoSrc);
      setVideoSRC(video.default);
    })();
  });

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onMouseOut={onMouseLeave}
      className="min-w-fit relative"
    >
      <div className="z-[1] w-[233px] h-[131px]">
        <img src={item.videoModel.image} className="w-full h-full" />
      </div>

      {!remove && (
        <div
          ref={ref}
          className="bg-transparent rounded-md overflow-hidden z-[2] absolute shadow-[0px_5px_15px_rgba(0,0,0,0.07)]"
          style={{
            top: 0,
            left: 0,
            animationName: active ? "card" : "card-exit",
            animationDuration: "0.6s",
            animationFillMode: "forwards",
            animationTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
            // animationDelay: !active ? "0.1s" : "0s",
            // transform: "scale(1.5)",
          }}
          onAnimationEnd={(e) => {
            if (e.animationName === "card-exit") {
              setRemove(true);
              // setVideo(false);
            }
          }}
        >
          <div className="">
            <div>
              <div
                className={`relative w-[233px] h-[131px]`}
                style={{
                  backgroundImage: `linear-gradient(
                    to bottom,
                    rgba(64, 64, 64, 1) 0%,
                    rgba(64, 64, 64, 0) 10%,
                    rgba(64, 64, 64, 0) 90%,
                    rgba(64, 64, 64, 1) 100%
                )`,
                }}
              >
                <video
                  id="video"
                  className={`${
                    video ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300`}
                  src={videoSRC}
                  muted={muted || mutedProp}
                  autoPlay
                />
                {mutedProp || muted ? (
                  <VolumeOffIcon onClick={toggleMute} />
                ) : (
                  <VolumeHigh onClick={toggleMute} />
                )}
              </div>

              <img
                src={item.videoModel.image}
                className={`absolute inset-0 w-[233px] h-[131px] ${
                  !video ? "opacity-100" : "opacity-0 pointer-events-none"
                } transition-opacity duration-300 `}
              />
            </div>
            <div
              className="p-4 bg-[#181818]"
              style={{
                animationName: active ? "card-cont-enter" : "card-cont-exit",
                animationDuration: "0.5s",
                animationFillMode: "forwards",
                // animationDelay: active ? "0s" : "0.2s",
                // animationTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
              }}
            >
              <div className="flex mb-2">
                <div className="flex gap-2">
                  <PlayIcon />
                  <PlusIcon />
                  <LikeIcon />
                </div>
                <div className="ml-auto">
                  <ExpandIcon />
                </div>
              </div>
              <div className="my-3 flex flex-col">
                <span className="text-[16px] pb-2 text-[#46d369] font-medium">
                  98% Match
                </span>
                <div className="flex gap-2 items-center">
                  <p className="px-[6px] rounded-sm text-[#bcbcbc] text-[16px] uppercase border leading-[19.2px] border-[#ffffff66]">
                    {item.videoModel.maturity.rating.value}
                  </p>
                  <p className="text-[#bcbcbc]">
                    {item.videoModel.numSeasonsLabel}
                  </p>
                  <div className="px-[5px] leading-[1] rounded-sm text-[#bcbcbc] text-[11px] uppercase border border-[#ffffff66]">
                    HD
                  </div>
                </div>
              </div>
              {/* <div>tags</div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PlayIcon = () => (
  <div className="min-w-[30px] flex items-center justify-center p-[6px] bg-white rounded-full">
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
);

export const PlusIcon = () => (
  <div className="flex items-center justify-center p-[6px] rounded-full text-white bg-[#2a2a2a99] border-2 border-[#ffffff80]">
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-name="Plus"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
);

export const LikeIcon = () => (
  <div className="flex items-center justify-center p-[6px] rounded-full text-white bg-[#2a2a2a99] border-2 border-[#ffffff80]">
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
);

export const ExpandIcon = () => (
  <div className="flex items-center justify-center p-[6px] rounded-full text-white bg-[#2a2a2a99] border-2 border-[#ffffff80]">
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
);

export const VolumeOffIcon = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="z-[3] absolute right-2 bottom-2 border-2 hover:text-white text-[#ffffff80] hover:border-white border-[#ffffff30] p-1.5 rounded-full"
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z"
        fill="currentColor"
      ></path>
    </svg>
  </button>
);

export const VolumeHigh = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="z-[3] absolute right-2 bottom-2 border-2 hover:text-white text-[#ffffff80] hover:border-white border-[#ffffff30] p-1.5 rounded-full"
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z"
        fill="currentColor"
      ></path>
    </svg>
  </button>
);
