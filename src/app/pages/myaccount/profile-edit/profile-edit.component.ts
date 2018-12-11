import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profile: any;
  profileImage: string;
  submitted = false;

  formEditProfile: FormGroup;
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) {

    this.formEditProfile = this.formBuilder.group({
      pFirstName: ['', [Validators.required]],
      pLastName: ['', []],
      pContactNo: ['', [Validators.required]],
      pEmail: ['', [Validators.required, Validators.email]],
      pDOB: ['', []],
      pGender: ['', [Validators.required]],
      pImage: ['', []]
    });

    this.customerService.getProfileDetails().subscribe(
      (data: any) => {
        if (data) {
          this.profile = data;
          this.profileImage = this.profile.ProfileImage;
          this.initializeProfile();
        }
      });
  }

  ngOnInit() {

  }

  initializeProfile() {
    this.formEditProfile = this.formBuilder.group({
      pFirstName: [this.profile.FirstName, [Validators.required]],
      pLastName: [this.profile.LastName, []],
      pContactNo: [this.profile.ContactNo, [Validators.required]],
      pEmail: [this.profile.EmailId, [Validators.required, Validators.email]],
      pDOB: [this.profile.DOBDt, []],
      pGender: [this.profile.Gender, []],
      pImage: [this.profile.ProfileImage, []]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.formEditProfile.controls; }

  uploadPicture(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ((e) => {
        this.profileImage = e.target['result'];
      });
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onProfileUpdate() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.formEditProfile.invalid) {
      return;
    }

    const profile = {
      FirstName: '', LastName: '', EmailId: '',
      ContactNo: '', DOB: '', Gender: '', UserIpAddress: '', ProfileImage: '',
      StoreId: 0, SessionId: '', UserId: 0, AppId: 0, DeviceId: '', DeviceType: ''
    };

    profile.FirstName = this.formEditProfile.get('pFirstName').value;
    profile.LastName = this.formEditProfile.get('pLastName').value;
    profile.ContactNo = this.formEditProfile.get('pContactNo').value;
    profile.EmailId = this.formEditProfile.get('pEmail').value;
    profile.DOB = this.formEditProfile.get('pDOB').value;
    profile.Gender = this.formEditProfile.get('pGender').value;
    // profile.ProfileImage = this.formEditProfile.get('pImage').value;
    // profile.UserIpAddress = '';


    this.customerService.updateCustomerProfile(profile).subscribe(
      (res) => {
        if (res) {
          this.toastr.success(res.SuccessMessage);
        }
        this.router.navigate(['myaccount/profile']);
      });

  }

}
