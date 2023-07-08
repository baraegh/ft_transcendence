import React, {useEffect} from "react";
import * as Popover from '@radix-ui/react-popover';
import "./popover.css"

const PopoverComp = (props : {Trigger: JSX.Element, Content: JSX.Element}) => {
    
    // useEffect(()=>{
    //     document.addEventListener('scroll', () => {});
    //     // Specify how to clean up after the effect:
    //     return () => {
    //       document.removeEventListener('scroll', () => {});
    //     };
    //   })

    return (
        <div className="popover-container">
            <Popover.Root>
                <Popover.Trigger>   
                    {props.Trigger}
                </Popover.Trigger>
                
                <Popover.Portal>
                    <Popover.Content  className="popover-content">
                    <Popover.Close className="PopoverClose" aria-label="Close">
                        <div>x</div>
                    </Popover.Close>
                        {props.Content}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
}

export default PopoverComp;