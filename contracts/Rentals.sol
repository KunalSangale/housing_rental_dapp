// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";

contract Rentals is Ownable {

  /// @notice Emitted when a new unit is added to the contract
  uint public unitCount = 1; 


  struct Unit {
    uint unitNumber;
    string unitAddress;
    string cid;
    State state;
    uint rent; 
    uint term;
    string startDate;
    uint deposit;
    address payable landlord;
    address payable tenant;
  }


  // <units mapping>
  mapping (uint => Unit) public units;


  // <enum State: Vacant, Occupied>
  enum State { ForRent, Occupied}


  /// @notice Emitted when a unit is added and listed of rent
  /// @param unitNumber Unit Number requiring state change
  event LogForRent(uint unitNumber);

  /// @notice Emitted when a unit is added 
  event LogUnitAdded(uint unitNumber); 

  constructor()  {}

  /// @notice Adds a unit under the ownership of a landlord 
  /// @param _unitAddress Address of the unit being listed
  /// @dev The landlord adding the unit must be the owner of the contract 
  /// @dev The unit number is automatically assigned
  function addUnit(
    string memory _unitAddress, 
    string memory _cid,
    uint _rent, 
    uint _deposit,
    uint _term, 
    string memory _startDate
    ) onlyOwner public  {
   

    units[unitCount] = Unit({
     unitNumber: unitCount,
     unitAddress: _unitAddress,
     cid:_cid,
     state: State.ForRent,
     rent: _rent,
     deposit: _deposit,
     term: _term,
     startDate: _startDate,
     landlord: payable(msg.sender),
     tenant: payable(address(0))
    });
    
    emit LogUnitAdded(unitCount);
    emit LogForRent(unitCount);
    unitCount = unitCount + 1;
    
  
  }

  

  /// @notice Allows landlord/tenant to fetch the details of a unit
  /// @param _unitNumber The unit number to be fetched
  function fetchUnit(uint _unitNumber) public view 
      returns (
        uint unitNumber, 
        string memory unitAddress,
        string memory cid,
        uint state, 
        uint rent, 
        uint deposit,
        uint term, 
        string memory startDate, 
        address landlord, 
        address tenant
        )  
    {
      unitNumber = units[_unitNumber].unitNumber; 
      unitAddress =  units[_unitNumber].unitAddress;
      cid = units[_unitNumber].cid;
      state = uint(units[_unitNumber].state); 
      rent = units[_unitNumber].rent;
      deposit = units[_unitNumber].deposit;
      term = units[_unitNumber].term;
      startDate = units[_unitNumber].startDate; 
      landlord = units[_unitNumber].landlord; 
      tenant = units[_unitNumber].tenant; 
      return (unitNumber, unitAddress ,cid, state,rent, deposit, term, startDate,  landlord, tenant); 
    } 
  
}
