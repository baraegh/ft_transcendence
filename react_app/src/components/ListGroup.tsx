import { Fragment } from "react"; // we can use the tag <fragment> and we willnot have an extra div for our dom
import { MouseEvent } from "react";
import 'bootstrap/dist/css/bootstrap.css';

function ListGroup()
{
    let items = ["Casa", "Ben guerrir", "El Jadida"];
    // event hanlder which its job to handle events 
    const ClickHandler = (event: MouseEvent) => console.log(event.clientX);
    return ( // we can use <> instead of the whole <fragment>
    <> 
    <h1>Header</h1>
    {items.length === 0 && <p>No Items Found</p>};
    <ul className="list-group-item active">
        {items.map(item => <li className="active" key = {item}onClick={ClickHandler}> {item}</li>)}
    </ul>
    </>); 
}

export default ListGroup;