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
    uint deposit;
    uint area;
    uint bhk;
    uint bathrooms;
    string reraNumber;
    address payable landlord;
    address payable tenant;
  }
  // struct UnitDetails {
  //   uint area;
    // uint bhk;
    // uint bathrooms;
  //   string preferredTenant;
  // }

  // <units mapping>
  mapping (uint => Unit) public units;
//mapping (uint => UnitDetails) public unitDetails;

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
    uint _area,
    uint _bhk,
    uint _bathrooms,
    string memory _reraNumber
    ) onlyOwner public  {
   

    units[unitCount] = Unit({
     unitNumber: unitCount,
     unitAddress: _unitAddress,
     cid:_cid,
     state: State.ForRent,
     rent: _rent,
     deposit: _deposit,
     area:_area,
     bhk:_bhk,
     bathrooms:_bathrooms,
     reraNumber:_reraNumber,
     landlord: payable(msg.sender),
     tenant: payable(address(0))
    });
    
    emit LogUnitAdded(unitCount);
    emit LogForRent(unitCount);
    unitCount = unitCount + 1;
  
  }
  //  function addUnitDetails(
  //     uint _area,
  //     uint _bhk,
  //     uint _bathrooms,
  //     string memory _preferredTenant
  //   ) onlyOwner public {
  //       unitDetails[unitCount]=UnitDetails({
  //         area: _area,
  //         bhk: _bhk,
  //         bathrooms: _bathrooms,
  //         preferredTenant: _preferredTenant
  //       });
  //   }
  

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
        uint area,
        uint bhk,
        uint bathrooms,
        string memory reraNumber,
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
      area=units[_unitNumber].area;
      bhk = units[_unitNumber].bhk;
      bathrooms = units[_unitNumber].bathrooms;
      reraNumber= units[_unitNumber].reraNumber;
      landlord = units[_unitNumber].landlord; 
      tenant = units[_unitNumber].tenant; 
      return (unitNumber, unitAddress ,cid, state,rent, deposit,area,bhk,bathrooms,reraNumber,landlord, tenant); 
    } 
  // function fetchUnitDetails(uint _unitNumber) public view
  //     returns(
  //         uint area,
  //         uint bhk,
  //         uint bathrooms,
  //         string memory preferredTenant
  //     )
  //   {
  //       area= unitDetails[_unitNumber].area;
      // bhk = unitDetails[_unitNumber].bhk;
      // bathrooms = unitDetails[_unitNumber].bathrooms;
  //     preferredTenant = unitDetails[_unitNumber].preferredTenant;
  //   }

  
}
