import requests
import sys
import json
from datetime import datetime

class HabitMasterAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_habit_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        print(f"   Method: {method}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "api/", 200)

    def test_register_user(self):
        """Test user registration"""
        test_user_data = {
            "username": "testuser2",
            "email": "testuser2@example.com",
            "dob": "1990-01-01",
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/register",
            200,
            data=test_user_data
        )
        
        if success and 'user_id' in response:
            self.user_id = response['user_id']
            return True
        return False

    def test_login_user(self):
        """Test user login"""
        login_data = {
            "email": "testuser2@example.com",
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            "email": "testuser2@example.com",
            "password": "wrongpassword"
        }
        
        success, response = self.run_test(
            "Login Invalid Credentials",
            "POST",
            "api/login",
            401,
            data=login_data
        )
        return success

    def test_get_habits_empty(self):
        """Test getting habits when none exist"""
        success, response = self.run_test(
            "Get Habits (Empty)",
            "GET",
            "api/habits",
            200
        )
        return success and isinstance(response, list) and len(response) == 0

    def test_create_habit(self):
        """Test creating a new habit"""
        habit_data = {
            "name": "Morning Exercise",
            "time": "07:00",
            "days": ["mon", "wed", "fri"]
        }
        
        success, response = self.run_test(
            "Create Habit",
            "POST",
            "api/habits",
            200,
            data=habit_data
        )
        
        if success and 'habit_id' in response:
            self.created_habit_id = response['habit_id']
            return True
        return False

    def test_get_habits_with_data(self):
        """Test getting habits after creating one"""
        success, response = self.run_test(
            "Get Habits (With Data)",
            "GET",
            "api/habits",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            habit = response[0]
            expected_fields = ['id', 'name', 'time', 'days', 'user_id', 'created_at']
            has_all_fields = all(field in habit for field in expected_fields)
            if has_all_fields:
                print(f"   Habit found: {habit['name']} at {habit['time']}")
                return True
        return False

    def test_get_completed_habits(self):
        """Test getting completed habits status"""
        success, response = self.run_test(
            "Get Completed Habits",
            "GET",
            "api/completed-habits",
            200
        )
        
        if success and 'completed' in response and 'pending' in response:
            print(f"   Completed: {len(response['completed'])}, Pending: {len(response['pending'])}")
            return True
        return False

    def test_complete_habit(self):
        """Test marking a habit as complete"""
        if not self.created_habit_id:
            print("❌ No habit ID available for completion test")
            return False
            
        complete_data = {
            "habit_id": self.created_habit_id
        }
        
        success, response = self.run_test(
            "Complete Habit",
            "POST",
            "api/complete-habit",
            200,
            data=complete_data
        )
        return success

    def test_get_progress(self):
        """Test getting progress statistics"""
        success, response = self.run_test(
            "Get Progress",
            "GET",
            "api/progress",
            200
        )
        
        if success:
            expected_fields = ['total_habits', 'completed_today', 'progress_percentage']
            has_all_fields = all(field in response for field in expected_fields)
            if has_all_fields:
                print(f"   Progress: {response['completed_today']}/{response['total_habits']} ({response['progress_percentage']:.1f}%)")
                return True
        return False

    def test_unauthorized_access(self):
        """Test accessing protected endpoints without token"""
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Unauthorized Access",
            "GET",
            "api/habits",
            401
        )
        
        # Restore token
        self.token = original_token
        return success

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("🚀 Starting HabitMaster API Tests")
        print("=" * 50)
        
        # Test sequence
        tests = [
            ("Root Endpoint", self.test_root_endpoint),
            ("User Registration", self.test_register_user),
            ("User Login", self.test_login_user),
            ("Invalid Login", self.test_login_invalid_credentials),
            ("Unauthorized Access", self.test_unauthorized_access),
            ("Get Empty Habits", self.test_get_habits_empty),
            ("Create Habit", self.test_create_habit),
            ("Get Habits with Data", self.test_get_habits_with_data),
            ("Get Completed Habits", self.test_get_completed_habits),
            ("Complete Habit", self.test_complete_habit),
            ("Get Progress", self.test_get_progress),
        ]
        
        failed_tests = []
        
        for test_name, test_func in tests:
            try:
                if not test_func():
                    failed_tests.append(test_name)
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {str(e)}")
                failed_tests.append(test_name)
        
        # Print results
        print("\n" + "=" * 50)
        print("📊 TEST RESULTS")
        print("=" * 50)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in failed_tests:
                print(f"   - {test}")
        else:
            print("\n🎉 All tests passed!")
        
        return len(failed_tests) == 0

def main():
    # Check if backend URL is provided
    backend_url = "http://localhost:8001"
    
    print(f"Testing HabitMaster API at: {backend_url}")
    
    tester = HabitMasterAPITester(backend_url)
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())